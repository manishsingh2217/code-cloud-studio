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

// Language to Judge0 language_id mapping
const languageMap: Record<string, number> = {
  python: 71,      // Python 3
  javascript: 63,  // JavaScript (Node.js)
  java: 62,        // Java
  cpp: 54,         // C++ (GCC)
  c: 50,           // C (GCC)
  go: 60,          // Go
  rust: 73,        // Rust
  kotlin: 78,      // Kotlin
};

const JUDGE0_HOSTS = ['https://ce.judge0.com'];

const MAX_CODE_BYTES = 200_000;
const MAX_STDIN_BYTES = 100_000;
const ATTEMPT_TIMEOUT_MS = 45_000;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function submitOnce(host: string, payload: unknown) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ATTEMPT_TIMEOUT_MS);
  try {
    return await fetch(`${host}/submissions?base64_encoded=false&wait=true`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timer);
  }
}

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

    const { code, language, stdin } = body ?? {};

    if (typeof code !== 'string' || !code.trim()) {
      return json({ error: 'There is no code to run. Write some code first.' }, 400);
    }
    if (typeof language !== 'string' || !language) {
      return json({ error: 'No programming language was selected.' }, 400);
    }
    if (stdin != null && typeof stdin !== 'string') {
      return json({ error: 'Program input must be text.' }, 400);
    }
    if (new TextEncoder().encode(code).length > MAX_CODE_BYTES) {
      return json({ error: 'Your code is too large to run (limit is about 200 KB).' }, 400);
    }
    if (stdin && new TextEncoder().encode(stdin).length > MAX_STDIN_BYTES) {
      return json({ error: 'Your program input is too large (limit is about 100 KB).' }, 400);
    }

    const languageId = languageMap[language];
    if (!languageId) {
      return json({ error: `"${language}" is not a supported language.` }, 400);
    }

    const payload = {
      source_code: code,
      language_id: languageId,
      stdin: stdin || '',
    };

    // Try each host, retrying transient failures (rate limits / upstream errors).
    let response: Response | null = null;
    let lastProblem = '';

    outer:
    for (const host of JUDGE0_HOSTS) {
      for (let attempt = 0; attempt < 3; attempt++) {
        try {
          const res = await submitOnce(host, payload);
          if (res.ok) {
            response = res;
            break outer;
          }
          const text = await res.text();
          lastProblem = `${res.status}: ${text.slice(0, 300)}`;
          console.error('Judge0 error', host, lastProblem);
          if (res.status === 429 || res.status >= 500) {
            await sleep(700 * (attempt + 1));
            continue;
          }
          break; // non-retryable for this host
        } catch (e) {
          lastProblem = e instanceof Error ? e.message : 'network error';
          console.error('Judge0 request failed', host, lastProblem);
          await sleep(700 * (attempt + 1));
        }
      }
    }

    if (!response) {
      const rateLimited = lastProblem.startsWith('429');
      return json(
        {
          error: rateLimited
            ? 'The code execution service is busy right now. Please wait a few seconds and run again.'
            : 'The code execution service is temporarily unavailable. Please try again in a moment.',
        },
        503,
      );
    }

    const result = await response.json();
    console.log('Judge0 result status:', result.status?.description);

    let output = '';
    let hasError = false;

    if (result.compile_output) {
      output += result.compile_output;
      hasError = true;
    }
    if (result.stdout) output += result.stdout;
    if (result.stderr) {
      output += result.stderr;
      hasError = true;
    }

    const statusId = result.status?.id;
    if (statusId === 5) {
      output += '\n[Time Limit Exceeded — your program took too long to finish]';
      hasError = true;
    } else if (statusId === 6) {
      output += '\n[Compilation Error — fix the errors above and run again]';
      hasError = true;
    } else if (typeof statusId === 'number' && statusId > 6) {
      output += `\n[${result.status?.description || 'Runtime Error'}]`;
      hasError = true;
    }

    if (result.message) output += `\n${result.message}`;

    return json({
      output: output.trim() || (hasError ? 'The program failed without any output.' : 'No output'),
      success: statusId === 3,
      status: result.status?.description ?? 'Unknown',
      exitCode: result.exit_code ?? 0,
    });
  } catch (error: unknown) {
    console.error('Error in execute-code function:', error);
    return json({ error: 'Something went wrong while running your code. Please try again.' }, 500);
  }
});
