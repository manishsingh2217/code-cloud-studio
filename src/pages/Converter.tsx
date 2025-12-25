import Editor from "@monaco-editor/react";
import { motion } from "framer-motion";
import { ArrowLeftRight, ChevronDown, Copy, Download } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

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

const sampleConversions: Record<string, Record<string, { input: string; output: string }>> = {
  python: {
    javascript: {
      input: `def greet(name):\n    return f"Hello, {name}!"\n\nresult = greet("World")\nprint(result)`,
      output: `function greet(name) {\n    return \`Hello, \${name}!\`;\n}\n\nconst result = greet("World");\nconsole.log(result);`,
    },
    java: {
      input: `def greet(name):\n    return f"Hello, {name}!"\n\nresult = greet("World")\nprint(result)`,
      output: `public class Main {\n    public static String greet(String name) {\n        return "Hello, " + name + "!";\n    }\n\n    public static void main(String[] args) {\n        String result = greet("World");\n        System.out.println(result);\n    }\n}`,
    },
  },
  javascript: {
    python: {
      input: `function greet(name) {\n    return \`Hello, \${name}!\`;\n}\n\nconst result = greet("World");\nconsole.log(result);`,
      output: `def greet(name):\n    return f"Hello, {name}!"\n\nresult = greet("World")\nprint(result)`,
    },
  },
};

export default function Converter() {
  const [sourceLanguage, setSourceLanguage] = useState(languages[0]);
  const [targetLanguage, setTargetLanguage] = useState(languages[1]);
  const [sourceCode, setSourceCode] = useState(
    sampleConversions.python.javascript.input
  );
  const [targetCode, setTargetCode] = useState(
    sampleConversions.python.javascript.output
  );
  const [isConverting, setIsConverting] = useState(false);

  const handleConvert = async () => {
    setIsConverting(true);
    setTargetCode("Converting...");

    // Simulate conversion (in production, this would call an AI backend)
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Check if we have a sample conversion
    const conversion = sampleConversions[sourceLanguage.id]?.[targetLanguage.id];
    if (conversion) {
      setTargetCode(conversion.output);
    } else {
      setTargetCode(
        `// Converted from ${sourceLanguage.name} to ${targetLanguage.name}\n// (AI conversion would happen here)\n\n${sourceCode}`
      );
    }

    setIsConverting(false);
    toast.success("Code converted successfully!");
  };

  const handleSwapLanguages = () => {
    const temp = sourceLanguage;
    setSourceLanguage(targetLanguage);
    setTargetLanguage(temp);
    const tempCode = sourceCode;
    setSourceCode(targetCode);
    setTargetCode(tempCode);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const handleDownload = (code: string, lang: string) => {
    const extensions: Record<string, string> = {
      python: "py",
      javascript: "js",
      java: "java",
      cpp: "cpp",
      c: "c",
      go: "go",
      rust: "rs",
      kotlin: "kt",
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
                    onClick={() => setSourceLanguage(lang)}
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
              disabled={isConverting}
              className="min-w-[200px]"
            >
              {isConverting ? "Converting..." : "Convert Code"}
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
