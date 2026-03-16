import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

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

const JUDGE0_API = 'https://ce.judge0.com';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { code, language, stdin } = await req.json();

    if (!code || !language) {
      return new Response(
        JSON.stringify({ error: 'Code and language are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const languageId = languageMap[language];
    if (!languageId) {
      return new Response(
        JSON.stringify({ error: `Unsupported language: ${language}` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Submit code to Judge0 CE with wait=true to get result immediately
    const submitResponse = await fetch(`${JUDGE0_API}/submissions?base64_encoded=false&wait=true`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        source_code: code,
        language_id: languageId,
        stdin: stdin || '',
      }),
    });

    if (!submitResponse.ok) {
      const errorText = await submitResponse.text();
      console.error('Judge0 API error:', errorText);
      return new Response(
        JSON.stringify({ error: 'Code execution service unavailable', details: errorText }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const result = await submitResponse.json();
    console.log('Judge0 result status:', result.status?.description);

    // Build output from Judge0 response
    let output = '';
    let hasError = false;

    if (result.compile_output) {
      output += result.compile_output;
      hasError = true;
    }

    if (result.stdout) {
      output += result.stdout;
    }

    if (result.stderr) {
      output += result.stderr;
      hasError = true;
    }

    // Check for time limit / memory limit exceeded
    if (result.status?.id === 5) {
      output += '\n[Time Limit Exceeded]';
      hasError = true;
    } else if (result.status?.id === 6) {
      output += '\n[Compilation Error]';
      hasError = true;
    } else if (result.status?.id > 6) {
      output += `\n[${result.status?.description || 'Runtime Error'}]`;
      hasError = true;
    }

    if (result.message) {
      output += result.message;
    }

    return new Response(
      JSON.stringify({
        output: output || 'No output',
        success: result.status?.id === 3, // 3 = Accepted (successful run)
        exitCode: result.exit_code || 0,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error in execute-code function:', error);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
