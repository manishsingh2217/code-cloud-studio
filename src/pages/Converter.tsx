import Editor from "@monaco-editor/react";
import { motion } from "framer-motion";
import { ArrowLeftRight, ChevronDown, Copy, Download, Loader2 } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const languages = [
  { id: "python", name: "Python" },
  { id: "javascript", name: "JavaScript" },
  { id: "java", name: "Java" },
  { id: "cpp", name: "C++" },
  { id: "c", name: "C" },
  { id: "go", name: "Go" },
  { id: "rust", name: "Rust" },
  { id: "kotlin", name: "Kotlin" },
];

const defaultCode: Record<string, string> = {
  python: `def greet(name):\n    return f"Hello, {name}!"\n\nresult = greet("World")\nprint(result)`,
  javascript: `function greet(name) {\n    return \`Hello, \${name}!\`;\n}\n\nconst result = greet("World");\nconsole.log(result);`,
  java: `public class Main {\n    public static String greet(String name) {\n        return "Hello, " + name + "!";\n    }\n\n    public static void main(String[] args) {\n        System.out.println(greet("World"));\n    }\n}`,
  cpp: `#include <iostream>\n#include <string>\n\nstd::string greet(const std::string& name) {\n    return "Hello, " + name + "!";\n}\n\nint main() {\n    std::cout << greet("World") << std::endl;\n    return 0;\n}`,
  c: `#include <stdio.h>\n\nvoid greet(const char* name) {\n    printf("Hello, %s!\\n", name);\n}\n\nint main() {\n    greet("World");\n    return 0;\n}`,
  go: `package main\n\nimport "fmt"\n\nfunc greet(name string) string {\n    return "Hello, " + name + "!"\n}\n\nfunc main() {\n    fmt.Println(greet("World"))\n}`,
  rust: `fn greet(name: &str) -> String {\n    format!("Hello, {}!", name)\n}\n\nfn main() {\n    println!("{}", greet("World"));\n}`,
  kotlin: `fun greet(name: String): String {\n    return "Hello, $name!"\n}\n\nfun main() {\n    println(greet("World"))\n}`,
};

export default function Converter() {
  const { user, loading } = useAuth();
  const [sourceLanguage, setSourceLanguage] = useState(languages[0]);
  const [targetLanguage, setTargetLanguage] = useState(languages[1]);
  const [sourceCode, setSourceCode] = useState(defaultCode.python);
  const [targetCode, setTargetCode] = useState("// Converted code will appear here");
  const [isConverting, setIsConverting] = useState(false);

  const handleEditorMount = useCallback((_editor: any, monaco: any) => {
    if (typeof document !== "undefined" && (document as any).fonts?.ready) {
      (document as any).fonts.ready.then(() => monaco?.editor?.remeasureFonts?.());
    }
  }, []);



  const handleConvert = async () => {
    if (!user) {
      toast.error("Please sign in to convert code");
      return;
    }

    if (!sourceCode.trim()) {
      toast.error("Please enter some code to convert");
      return;
    }

    if (sourceLanguage.id === targetLanguage.id) {
      toast.error("Source and target languages must be different");
      return;
    }

    setIsConverting(true);
    setTargetCode("Converting...");

    try {
      const { data, error } = await supabase.functions.invoke('convert-code', {
        body: {
          code: sourceCode,
          sourceLanguage: sourceLanguage.name,
          targetLanguage: targetLanguage.name,
        },
      });

      if (error) {
        setTargetCode(`// Error: ${error.message}`);
        toast.error("Conversion failed");
      } else if (data.error) {
        setTargetCode(`// Error: ${data.error}`);
        toast.error("Conversion failed");
      } else {
        setTargetCode(data.convertedCode || "// No output");
        toast.success("Code converted successfully!");
      }
    } catch (err: any) {
      setTargetCode(`// Error: ${err.message}`);
      toast.error("Failed to convert code");
    } finally {
      setIsConverting(false);
    }
  };

  const handleSwapLanguages = () => {
    const temp = sourceLanguage;
    setSourceLanguage(targetLanguage);
    setTargetLanguage(temp);
    const tempCode = sourceCode;
    setSourceCode(targetCode);
    setTargetCode(tempCode);
  };

  const handleSourceLanguageChange = (lang: typeof languages[0]) => {
    setSourceLanguage(lang);
    setSourceCode(defaultCode[lang.id] || "");
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const handleDownload = (code: string, lang: string) => {
    const extensions: Record<string, string> = {
      python: "py", javascript: "js", java: "java", cpp: "cpp",
      c: "c", go: "go", rust: "rs", kotlin: "kt",
    };
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `converted.${extensions[lang]}`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("File downloaded!");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-background py-6 sm:py-8 px-4">
      <div className="container max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">Code Converter</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Convert code between languages instantly with AI
            </p>
          </div>

          {/* Language Selectors */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="glass" className="min-w-[160px] justify-between">
                  {sourceLanguage.name}
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {languages.map((lang) => (
                  <DropdownMenuItem
                    key={lang.id}
                    onClick={() => handleSourceLanguageChange(lang)}
                  >
                    {lang.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleSwapLanguages}
              className="rounded-full"
            >
              <ArrowLeftRight className="h-5 w-5" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="glass" className="min-w-[160px] justify-between">
                  {targetLanguage.name}
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {languages.map((lang) => (
                  <DropdownMenuItem
                    key={lang.id}
                    onClick={() => setTargetLanguage(lang)}
                  >
                    {lang.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Editors */}
          <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Source Editor */}
            <div className="glass rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-3 sm:px-4 py-2 sm:py-3 border-b border-border">
                <span className="font-medium text-xs sm:text-sm">Source ({sourceLanguage.name})</span>
                <div className="flex gap-1 sm:gap-2">
                  <Button variant="ghost" size="icon" onClick={() => handleCopy(sourceCode)} className="h-8 w-8">
                    <Copy className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                </div>
              </div>
              <div className="h-[300px] sm:h-[400px]">
                <Editor
                  height="100%"
                  language={sourceLanguage.id}
                  theme="vs-dark"
                  value={sourceCode}
                  onChange={(value) => setSourceCode(value || "")}
                  options={{
                    fontSize: 14,
                    fontFamily: "JetBrains Mono, monospace",
                    minimap: { enabled: false },
                    padding: { top: 16, bottom: 16 },
                    scrollBeyondLastLine: false,
                  }}
                />
              </div>
            </div>

            {/* Target Editor */}
            <div className="glass rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-3 sm:px-4 py-2 sm:py-3 border-b border-border">
                <span className="font-medium text-xs sm:text-sm">Target ({targetLanguage.name})</span>
                <div className="flex gap-1 sm:gap-2">
                  <Button variant="ghost" size="icon" onClick={() => handleCopy(targetCode)} className="h-8 w-8">
                    <Copy className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDownload(targetCode, targetLanguage.id)}
                    className="h-8 w-8"
                  >
                    <Download className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                </div>
              </div>
              <div className="h-[300px] sm:h-[400px]">
                <Editor
                  height="100%"
                  language={targetLanguage.id}
                  theme="vs-dark"
                  value={targetCode}
                  options={{
                    fontSize: 14,
                    fontFamily: "JetBrains Mono, monospace",
                    minimap: { enabled: false },
                    padding: { top: 16, bottom: 16 },
                    scrollBeyondLastLine: false,
                    readOnly: true,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Convert Button */}
          <div className="flex justify-center mt-8">
            <Button
              variant="hero"
              size="xl"
              onClick={handleConvert}
              disabled={isConverting || !user}
              className="min-w-[200px]"
            >
              {isConverting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Converting...
                </>
              ) : !user ? (
                "Sign in to convert"
              ) : (
                "Convert Code"
              )}
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
