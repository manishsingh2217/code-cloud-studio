import Editor from "@monaco-editor/react";
import { motion } from "framer-motion";
import {
  ChevronDown,
  Copy,
  Download,
  Loader2,
  Play,
  RotateCcw,
  Save,
  Terminal,
  Trash2,
  Upload,
} from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useUserFiles } from "@/hooks/useUserFiles";

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
  const { user } = useAuth();
  const { saveFile } = useUserFiles();
  
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);
  const [code, setCode] = useState(languages[0].template);
  const [output, setOutput] = useState("");
  const [stdin, setStdin] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [fileName, setFileName] = useState("");
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load file from sessionStorage if coming from dashboard
  useEffect(() => {
    const openFile = sessionStorage.getItem('openFile');
    if (openFile) {
      try {
        const file = JSON.parse(openFile);
        const lang = languages.find(l => l.name === file.language) || languages[0];
        setSelectedLanguage(lang);
        setCode(file.code || lang.template);
        setFileName(file.name || "");
        sessionStorage.removeItem('openFile');
      } catch (e) {
        console.error('Error loading file:', e);
      }
    }
  }, []);

  const handleLanguageChange = (lang: typeof languages[0]) => {
    setSelectedLanguage(lang);
    setCode(lang.template);
    setOutput("");
  };

  const handleRun = async () => {
    setIsRunning(true);
    setOutput("Running...\n");
    
    try {
      const { data, error } = await supabase.functions.invoke('execute-code', {
        body: {
          code,
          language: selectedLanguage.id,
          stdin,
        },
      });

      if (error) {
        setOutput(`Error: ${error.message}`);
        toast.error("Execution failed");
      } else if (data.error) {
        setOutput(`Error: ${data.error}`);
        toast.error("Execution failed");
      } else {
        setOutput(data.output || "No output");
        if (data.success) {
          toast.success("Code executed successfully!");
        } else {
          toast.warning("Execution completed with errors");
        }
      }
    } catch (err: any) {
      setOutput(`Error: ${err.message}`);
      toast.error("Failed to execute code");
    } finally {
      setIsRunning(false);
    }
  };

  const handleSave = async () => {
    if (!user) {
      toast.error("Please sign in to save files");
      return;
    }
    
    if (!fileName.trim()) {
      toast.error("Please enter a file name");
      return;
    }

    setIsSaving(true);
    const fullName = fileName.includes('.') ? fileName : `${fileName}.${selectedLanguage.extension}`;
    
    const result = await saveFile(fullName, selectedLanguage.name, code);
    
    if (result) {
      toast.success("Code saved to cloud!");
      setShowSaveDialog(false);
      setFileName("");
    }
    setIsSaving(false);
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
    setStdin("");
    toast.info("Editor reset to default");
  };

  const handleClear = () => {
    setCode("");
    toast.info("Code cleared");
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
              {isRunning ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Play className="h-4 w-4" />
              )}
              <span className="hidden sm:inline">Run</span>
            </Button>

            <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
              <DialogTrigger asChild>
                <Button variant="glass" size="sm">
                  <Save className="h-4 w-4" />
                  <span className="hidden sm:inline ml-2">Save</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Save to Cloud</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="filename">File Name</Label>
                    <Input
                      id="filename"
                      placeholder={`my_code.${selectedLanguage.extension}`}
                      value={fileName}
                      onChange={(e) => setFileName(e.target.value)}
                    />
                  </div>
                  <Button 
                    onClick={handleSave} 
                    className="w-full"
                    disabled={isSaving || !user}
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : !user ? (
                      "Sign in to save"
                    ) : (
                      "Save File"
                    )}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

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

            <Button variant="ghost" size="icon" onClick={handleClear} title="Clear code">
              <Trash2 className="h-4 w-4" />
            </Button>

            <Button variant="ghost" size="icon" onClick={handleReset} title="Reset to template">
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Editor & Output */}
        <div className="flex-1 flex flex-col lg:flex-row">
          {/* Editor */}
          <div className="flex-1 min-h-[300px] lg:min-h-0">
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

          {/* Right Panel: Input & Output */}
          <div className="lg:w-[400px] border-t lg:border-t-0 lg:border-l border-border bg-card/50 flex flex-col">
            {/* User Input Section */}
            <div className="border-b border-border">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
                <Terminal className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Input (stdin)</span>
              </div>
              <div className="p-4">
                <Textarea
                  placeholder="Enter input for your program..."
                  value={stdin}
                  onChange={(e) => setStdin(e.target.value)}
                  className="font-mono text-sm resize-none h-[100px]"
                />
              </div>
            </div>

            {/* Output Panel */}
            <div className="flex-1 flex flex-col min-h-[200px]">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
                <div className="w-2 h-2 rounded-full bg-accent" />
                <span className="text-sm font-medium">Output</span>
              </div>
              <div className="flex-1 p-4 font-mono text-sm overflow-auto">
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
        </div>
      </motion.div>
    </div>
  );
}
