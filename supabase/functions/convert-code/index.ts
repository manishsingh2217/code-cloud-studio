import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });

const MAX_CODE_BYTES = 100_000;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405);
  }

  try {
    let body: any;
    try {
      body = await req.json();
    } catch {
      return json({ error: 'Invalid request. Expected JSON body.' }, 400);
    }

    const { code, sourceLanguage, targetLanguage } = body ?? {};

    if (typeof code !== 'string' || !code.trim()) {
      return json({ error: 'There is no code to convert.' }, 400);
    }
    if (typeof sourceLanguage !== 'string' || !sourceLanguage.trim() ||
        typeof targetLanguage !== 'string' || !targetLanguage.trim()) {
      return json({ error: 'Please choose both a source and a target language.' }, 400);
    }
    if (sourceLanguage.trim().toLowerCase() === targetLanguage.trim().toLowerCase()) {
      return json({ error: 'Source and target languages must be different.' }, 400);
    }
    if (new TextEncoder().encode(code).length > MAX_CODE_BYTES) {
      return json({ error: 'Your code is too large to convert (limit is about 100 KB).' }, 400);
    }

    const apiKey = Deno.env.get('LOVABLE_API_KEY');
    if (!apiKey) {
      return json({ error: 'The conversion service is not configured yet.' }, 500);
    }

    const requestBody = JSON.stringify({
      model: 'google/gemini-3-flash-preview',
      messages: [
        {
          role: 'system',
          content: `You are a code converter. Convert code from ${sourceLanguage} to ${targetLanguage}. Return ONLY the converted, runnable code without any explanation, markdown formatting, or code blocks. Just the raw code.`,
        },
        { role: 'user', content: code },
      ],
      temperature: 0.2,
    });

    let response: Response | null = null;
    let lastStatus = 0;
    let lastText = '';

    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const res = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: requestBody,
        });

        if (res.ok) {
          response = res;
          break;
        }

        lastStatus = res.status;
        lastText = (await res.text()).slice(0, 500);
        console.error('AI Gateway error:', lastStatus, lastText);

        if (res.status === 429 || res.status >= 500) {
          const retryAfter = Number(res.headers.get('Retry-After'));
          await sleep(Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter * 1000 : 1000 * (attempt + 1));
          continue;
        }
        break; // terminal error
      } catch (e) {
        lastStatus = 0;
        lastText = e instanceof Error ? e.message : 'network error';
        console.error('AI Gateway request failed:', lastText);
        await sleep(1000 * (attempt + 1));
      }
    }

    if (!response) {
      if (lastStatus === 429) {
        return json({ error: 'Too many conversions right now. Please wait a few seconds and try again.' }, 429);
      }
      if (lastStatus === 402) {
        return json({ error: 'AI credits have run out. Please add credits to keep using the converter.' }, 402);
      }
      if (lastStatus === 403) {
        return json({ error: 'AI conversion is currently blocked for this workspace.' }, 403);
      }
      return json({ error: 'The conversion service is temporarily unavailable. Please try again in a moment.' }, 503);
    }

    const result = await response.json();
    let convertedCode: string = result.choices?.[0]?.message?.content || '';

    // Strip markdown code fences if the model added them
    convertedCode = convertedCode
      .replace(/^\s*```[\w+#-]*\s*\n?/m, '')
      .replace(/\n?```\s*$/m, '')
      .trim();

    if (!convertedCode) {
      return json({ error: 'The converter returned an empty result. Please try again.' }, 502);
    }

    return json({ convertedCode });
  } catch (error: unknown) {
    console.error('Error in convert-code function:', error);
    return json({ error: 'Something went wrong while converting your code. Please try again.' }, 500);
  }
});
