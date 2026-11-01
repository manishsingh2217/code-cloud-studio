import { useState } from "react";
import { Loader2, Play } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { getFunctionErrorMessage } from "@/lib/functionError";
import { cn } from "@/lib/utils";

const snippets = [
  {
    id: "python",
    label: "main.py",
    code: `def fib(n):
    a, b = 0, 1
    for _ in range(n):
        a, b = b, a + b
    return a

print([fib(i) for i in range(10)])`,
  },
  {
    id: "cpp",
    label: "main.cpp",
    code: `#include <iostream>
#include <vector>
#include <algorithm>

int main() {
    std::vector<int> v = {42, 7, 19, 3, 88};
    std::sort(v.begin(), v.end());
    for (int x : v) std::cout << x << " ";
}`,
  },
  {
    id: "rust",
    label: "main.rs",
    code: `fn main() {
    let words = ["ship", "it", "today"];
    let total: usize = words.iter().map(|w| w.len()).sum();
    println!("{} chars across {} words", total, words.len());
}`,
  },
];

export function HeroPlayground() {
  const [active, setActive] = useState(0);
  const [codes, setCodes] = useState(snippets.map((s) => s.code));
  const [output, setOutput] = useState<string | null>(null);
  const [status, setStatus] = useState<{ ok: boolean; ms: number } | null>(null);
  const [running, setRunning] = useState(false);

  const run = async () => {
    setRunning(true);
    setOutput(null);
    setStatus(null);
    const start = performance.now();
    let ok = false;
    try {
      const { data, error } = await supabase.functions.invoke("execute-code", {
        body: { code: codes[active], language: snippets[active].id, stdin: "" },
      });
      if (error) setOutput(await getFunctionErrorMessage(error));
      else if (data?.error) setOutput(data.error);
      else {
        setOutput(data?.output || "No output");
        ok = !!data?.success;
      }
    } catch (e) {
      setOutput(await getFunctionErrorMessage(e));
    } finally {
      setStatus({ ok, ms: Math.round(performance.now() - start) });
      setRunning(false);
    }
  };

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden text-left">
      <div className="flex items-center border-b border-border bg-muted/40">
        {snippets.map((s, i) => (
          <button
            key={s.id}
            onClick={() => { setActive(i); setOutput(null); setStatus(null); }}
            className={cn(
              "px-4 py-2.5 text-xs font-mono border-r border-border transition-colors",
              i === active
                ? "bg-card text-foreground shadow-[inset_0_-2px_0_hsl(var(--primary))]"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {s.label}
          </button>
        ))}
        <button
          onClick={run}
          disabled={running}
          className="ml-auto mr-2 inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
        >
          {running ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Play className="h-3.5 w-3.5" />}
          Run
        </button>
      </div>
      <textarea
        value={codes[active]}
        spellCheck={false}
        onChange={(e) => setCodes((c) => c.map((v, i) => (i === active ? e.target.value : v)))}
        className="block w-full h-56 resize-none bg-code-bg p-4 font-mono text-[13px] leading-6 text-foreground outline-none"
        aria-label="Try editing this code"
      />
      <div className="border-t border-border px-4 py-3 font-mono text-xs min-h-[64px]">
        <div className="flex items-center justify-between text-muted-foreground mb-1">
          <span><span className="text-primary">❯</span> output</span>
          {status && (
            <span className={status.ok ? "text-primary" : "text-destructive"}>
              {status.ok ? "exit 0" : "error"} · {status.ms} ms
            </span>
          )}
        </div>
        <pre className="whitespace-pre-wrap break-words text-foreground">
          {running ? "compiling…" : output ?? "Edit the code above, then press Run."}
        </pre>
      </div>
    </div>
  );
}
