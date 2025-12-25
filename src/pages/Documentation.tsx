import { motion } from "framer-motion";
import { Book, ChevronRight, Code2, ExternalLink } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const languages = [
  {
    id: "python",
    name: "Python",
    color: "bg-yellow-500",
    description: "A versatile, beginner-friendly language great for data science, AI, and web development.",
    syntax: "# Variables\nname = 'CloudCode'\nversion = 1.0\n\n# Functions\ndef greet(name):\n    return f'Hello, {name}!'\n\n# Lists\nlanguages = ['Python', 'JavaScript']\nfor lang in languages:\n    print(lang)",
    examples: [
      { title: "Hello World", code: "print('Hello, World!')" },
      { title: "Fibonacci", code: "def fib(n):\n    if n <= 1:\n        return n\n    return fib(n-1) + fib(n-2)\n\nfor i in range(10):\n    print(fib(i))" },
    ],
  },
  {
    id: "javascript",
    name: "JavaScript",
    color: "bg-amber-400",
    description: "The language of the web, essential for frontend and backend development.",
    syntax: "// Variables\nconst name = 'CloudCode';\nlet version = 1.0;\n\n// Functions\nfunction greet(name) {\n    return 'Hello, ' + name + '!';\n}\n\n// Arrays\nconst langs = ['Python', 'JavaScript'];\nlangs.forEach(l => console.log(l));",
    examples: [
      { title: "Hello World", code: "console.log('Hello, World!');" },
      { title: "Fetch API", code: "fetch('https://api.example.com/data')\n  .then(res => res.json())\n  .then(data => console.log(data));" },
    ],
  },
  {
    id: "java",
    name: "Java",
    color: "bg-red-500",
    description: "A powerful, platform-independent language used for enterprise applications.",
    syntax: "// Main class\npublic class Main {\n    public static void main(String[] args) {\n        String name = 'CloudCode';\n        System.out.println('Hello, World!');\n    }\n}",
    examples: [
      { title: "Hello World", code: "public class Main {\n    public static void main(String[] args) {\n        System.out.println('Hello, World!');\n    }\n}" },
    ],
  },
  {
    id: "cpp",
    name: "C++",
    color: "bg-blue-600",
    description: "High-performance language for systems programming and game development.",
    syntax: "#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << 'Hello, World!' << endl;\n    return 0;\n}",
    examples: [
      { title: "Hello World", code: "#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << 'Hello, World!' << endl;\n    return 0;\n}" },
    ],
  },
  {
    id: "c",
    name: "C",
    color: "bg-gray-600",
    description: "Foundational language for operating systems and embedded systems.",
    syntax: "#include <stdio.h>\n\nint main() {\n    printf('Hello, World!\\n');\n    return 0;\n}",
    examples: [
      { title: "Hello World", code: "#include <stdio.h>\n\nint main() {\n    printf('Hello, World!\\n');\n    return 0;\n}" },
    ],
  },
  {
    id: "go",
    name: "Go",
    color: "bg-cyan-500",
    description: "Modern language by Google, excellent for cloud services and microservices.",
    syntax: "package main\n\nimport 'fmt'\n\nfunc main() {\n    fmt.Println('Hello, World!')\n}",
    examples: [
      { title: "Hello World", code: "package main\n\nimport 'fmt'\n\nfunc main() {\n    fmt.Println('Hello, World!')\n}" },
    ],
  },
  {
    id: "rust",
    name: "Rust",
    color: "bg-orange-600",
    description: "Memory-safe systems language with zero-cost abstractions.",
    syntax: "fn main() {\n    println!('Hello, World!');\n}",
    examples: [
      { title: "Hello World", code: "fn main() {\n    println!('Hello, World!');\n}" },
    ],
  },
  {
    id: "kotlin",
    name: "Kotlin",
    color: "bg-purple-500",
    description: "Modern language for Android development and JVM applications.",
    syntax: "fun main() {\n    println('Hello, World!')\n}",
    examples: [
      { title: "Hello World", code: "fun main() {\n    println('Hello, World!')\n}" },
    ],
  },
];

export default function Documentation() {
  const [selectedLang, setSelectedLang] = useState(languages[0]);
  const [activeTab, setActiveTab] = useState<"syntax" | "examples">("syntax");

  return (
    <div className="min-h-screen bg-background">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="container mx-auto px-4 py-12"
      >
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6"
          >
            <Book className="h-4 w-4" />
            <span className="text-sm font-medium">Documentation</span>
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Language Reference
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Quick reference guides and examples for all supported programming languages.
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Language Selector */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-2">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                Languages
              </h3>
              {languages.map((lang) => (
                <button
                  key={lang.id}
                  onClick={() => setSelectedLang(lang)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-left",
                    selectedLang.id === lang.id
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted text-foreground"
                  )}
                >
                  <div className={cn("w-3 h-3 rounded-full", lang.color)} />
                  <span className="font-medium">{lang.name}</span>
                  {selectedLang.id === lang.id && (
                    <ChevronRight className="h-4 w-4 ml-auto" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            <motion.div
              key={selectedLang.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              {/* Language Header */}
              <div className="flex items-start gap-4">
                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", selectedLang.color)}>
                  <Code2 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-foreground">
                    {selectedLang.name}
                  </h2>
                  <p className="text-muted-foreground mt-1">
                    {selectedLang.description}
                  </p>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex gap-4 border-b border-border">
                <button
                  onClick={() => setActiveTab("syntax")}
                  className={cn(
                    "px-4 py-2 font-medium transition-colors",
                    activeTab === "syntax"
                      ? "text-primary border-b-2 border-primary"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Syntax Guide
                </button>
                <button
                  onClick={() => setActiveTab("examples")}
                  className={cn(
                    "px-4 py-2 font-medium transition-colors",
                    activeTab === "examples"
                      ? "text-primary border-b-2 border-primary"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Examples
                </button>
              </div>

              {/* Content */}
              {activeTab === "syntax" ? (
                <div className="bg-card rounded-xl border border-border overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 bg-muted/50 border-b border-border">
                    <span className="text-sm font-medium text-foreground">
                      Basic Syntax
                    </span>
                    <a
                      href={`https://www.google.com/search?q=${selectedLang.name}+documentation`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sm text-primary hover:underline"
                    >
                      Official Docs
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                  <pre className="p-6 overflow-x-auto">
                    <code className="text-sm font-mono text-foreground whitespace-pre-wrap">
                      {selectedLang.syntax}
                    </code>
                  </pre>
                </div>
              ) : (
                <div className="space-y-6">
                  {selectedLang.examples.map((example, idx) => (
                    <div
                      key={idx}
                      className="bg-card rounded-xl border border-border overflow-hidden"
                    >
                      <div className="px-4 py-3 bg-muted/50 border-b border-border">
                        <span className="text-sm font-medium text-foreground">
                          {example.title}
                        </span>
                      </div>
                      <pre className="p-6 overflow-x-auto">
                        <code className="text-sm font-mono text-foreground whitespace-pre-wrap">
                          {example.code}
                        </code>
                      </pre>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
