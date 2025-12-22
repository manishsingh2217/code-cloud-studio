import Editor from "@monaco-editor/react";
import { motion } from "framer-motion";
import {
  ChevronDown,
  Copy,
  Download,
  Play,
  RotateCcw,
  Save,
  Upload,
} from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

const languages = [
  { id: "python", name: "Python", extension: "py", template: 'print("Hello, World!")' },
  { id: "javascript", name: "JavaScript", extension: "js", template: 'console.log("Hello, World!");' },
  { id: "java", name: "Java", extension: "java", template: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}' },
  { id: "cpp", name: "C++", extension: "cpp", template: '#include <iostream>\n\nint main() {\n    std::cout << "Hello, World!" << std::endl;\n    return 0;\n}' },
  { id: "c", name: "C", extension: "c", template: '#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}' },
  { id: "go", name: "Go", extension: "go", template: 'package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello, World!")\n}' },
  { id: "rust", name: "Rust", extension: "rs", template: 'fn main() {\n    println!("Hello, World!");\n}' },
  { id: "kotlin", name: "Kotlin", extension: "kt", template: 'fun main() {\n    println("Hello, World!")\n}' },
];

export default function EditorPage() {
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);
  const [code, setCode] = useState(languages[0].template);
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLanguageChange = (lang: typeof languages[0]) => {
    setSelectedLanguage(lang);
    setCode(lang.template);
    setOutput("");
  };

  const handleRun = async () => {
    setIsRunning(true);
    setOutput("Running...");
    
    // Simulate code execution (in production, this would call a backend)
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Mock output based on language
    const mockOutputs: Record<string, string> = {
      python: "Hello, World!",
      javascript: "Hello, World!",
      java: "Hello, World!",
      cpp: "Hello, World!",
      c: "Hello, World!",
      go: "Hello, World!",
      rust: "Hello, World!",
      kotlin: "Hello, World!",
    };
    
    setOutput(mockOutputs[selectedLanguage.id] || "Execution complete.");
    setIsRunning(false);
    toast.success("Code executed successfully!");
  };

  const handleSave = () => {
    toast.success("Code saved to cloud!");
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `main.${selectedLanguage.extension}`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("File downloaded!");
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCode(event.target?.result as string);
        toast.success("File uploaded!");
      };
      reader.readAsText(file);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    toast.success("Code copied to clipboard!");
  };

  const handleReset = () => {
    setCode(selectedLanguage.template);
    setOutput("");
    toast.info("Editor reset to default");
  };

  return (
    <div className="min-h-screen bg-background">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="h-[calc(100vh-4rem)] flex flex-col"
      >
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 px-4 py-3 border-b border-border glass">
          {/* Language Selector */}
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="glass" className="min-w-[140px] justify-between">
                  {selectedLanguage.name}
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[140px]">
                {languages.map((lang) => (
                  <DropdownMenuItem
                    key={lang.id}
                    onClick={() => handleLanguageChange(lang)}
                  >
                    {lang.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <span className="text-sm text-muted-foreground hidden sm:block">
              main.{selectedLanguage.extension}
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="hero"
              size="sm"
              onClick={handleRun}
              disabled={isRunning}
              className="gap-2"
            >
              <Play className="h-4 w-4" />
              <span className="hidden sm:inline">Run</span>
            </Button>

            <Button variant="glass" size="sm" onClick={handleSave}>
              <Save className="h-4 w-4" />
              <span className="hidden sm:inline ml-2">Save</span>
            </Button>

            <Button variant="ghost" size="icon" onClick={handleDownload}>
              <Download className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-4 w-4" />
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleUpload}
              accept=".py,.js,.java,.cpp,.c,.go,.rs,.kt"
            />

            <Button variant="ghost" size="icon" onClick={handleCopy}>
              <Copy className="h-4 w-4" />
            </Button>

            <Button variant="ghost" size="icon" onClick={handleReset}>
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Editor & Output */}
        <div className="flex-1 flex flex-col lg:flex-row">
          {/* Editor */}
          <div className="flex-1 min-h-[400px] lg:min-h-0">
            <Editor
              height="100%"
              language={selectedLanguage.id}
              theme="vs-dark"
              value={code}
              onChange={(value) => setCode(value || "")}
              options={{
                fontSize: 14,
                fontFamily: "JetBrains Mono, monospace",
                minimap: { enabled: false },
                padding: { top: 16, bottom: 16 },
                scrollBeyondLastLine: false,
                automaticLayout: true,
                lineNumbers: "on",
                roundedSelection: true,
                cursorBlinking: "smooth",
                cursorSmoothCaretAnimation: "on",
              }}
            />
          </div>

          {/* Output Panel */}
          <div className="lg:w-[400px] border-t lg:border-t-0 lg:border-l border-border bg-card/50">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
              <div className="w-2 h-2 rounded-full bg-accent" />
              <span className="text-sm font-medium">Output</span>
            </div>
            <div className="p-4 font-mono text-sm h-[200px] lg:h-[calc(100%-48px)] overflow-auto">
              {output ? (
                <pre className="text-foreground whitespace-pre-wrap">
                  {output}
                </pre>
              ) : (
                <p className="text-muted-foreground">
                  Click "Run" to execute your code...
                </p>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
