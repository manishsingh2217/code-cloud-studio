/**
 * Turns a supabase.functions.invoke() failure into a clear, user-friendly message.
 * Edge functions return { error: "..." } on non-2xx responses, but supabase-js
 * only surfaces a generic "Edge Function returned a non-2xx status code", so we
 * read the real message out of the attached Response.
 */
export async function getFunctionErrorMessage(error: unknown): Promise<string> {
  const anyError = error as any;

  const ctx = anyError?.context;
  if (ctx && typeof ctx.text === "function") {
    try {
      const raw = await ctx.text();
      try {
        const parsed = JSON.parse(raw);
        if (parsed?.error) return String(parsed.error);
      } catch {
        if (raw?.trim()) return raw.trim().slice(0, 300);
      }
    } catch {
      /* fall through to generic handling */
    }
  }

  const message = String(anyError?.message ?? "");
  if (/failed to fetch|networkerror|load failed/i.test(message)) {
    return "Can't reach the server. Check your internet connection (or disable an ad blocker) and try again.";
  }
  if (/non-2xx/i.test(message)) {
    return "The service is temporarily unavailable. Please try again in a moment.";
  }
  return message || "Something went wrong. Please try again.";
}
