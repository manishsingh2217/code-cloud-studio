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
    syntax: `# Variables and Data Types
name = "CloudCode"
version = 1.0
is_awesome = True

# Functions
def greet(name):
    return f"Hello, {name}!"

# Lists and Loops
languages = ["Python", "JavaScript", "Java"]
for lang in languages:
    print(lang)

# Classes
class Editor:
    def __init__(self, name):
        self.name = name
    
    def run(self):
        print(f"{self.name} is running...")`,
    examples: [
      {
        title: "Hello World",
        code: 'print("Hello, World!")',
      },
      {
        title: "Fibonacci Sequence",
        code: `def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

for i in range(10):
    print(fibonacci(i))`,
      },
    ],
  },
  {
    id: "javascript",
    name: "JavaScript",
    color: "bg-amber-400",
    description: "The language of the web, essential for frontend and increasingly popular for backend development.",
    syntax: `// Variables and Data Types
const name = "CloudCode";
let version = 1.0;
var isAwesome = true;

// Functions
function greet(name) {
    return \`Hello, \${name}!\`;
}

// Arrow Functions
const add = (a, b) => a + b;

// Arrays and Loops
const languages = ["Python", "JavaScript", "Java"];
languages.forEach(lang => console.log(lang));

// Classes
class Editor {
    constructor(name) {
        this.name = name;
    }
    
    run() {
        console.log(\`\${this.name} is running...\`);
    }
}`,
    examples: [
      {
        title: "Hello World",
        code: 'console.log("Hello, World!");',
      },
      {
        title: "Array Methods",
        code: `const numbers = [1, 2, 3, 4, 5];

const doubled = numbers.map(n => n * 2);
const evens = numbers.filter(n => n % 2 === 0);
const sum = numbers.reduce((a, b) => a + b, 0);

console.log(doubled); // [2, 4, 6, 8, 10]
console.log(evens);   // [2, 4]
console.log(sum);     // 15`,
      },
    ],
  },
  {
    id: "java",
    name: "Java",
    color: "bg-red-500",
    description: "A robust, object-oriented language used for enterprise applications and Android development.",
    syntax: `// Main Class
public class Main {
    public static void main(String[] args) {
        // Variables
        String name = "CloudCode";
        double version = 1.0;
        boolean isAwesome = true;
        
        // Method call
        System.out.println(greet("World"));
        
        // Arrays
        String[] languages = {"Python", "JavaScript", "Java"};
        for (String lang : languages) {
            System.out.println(lang);
        }
    }
    
    public static String greet(String name) {
        return "Hello, " + name + "!";
    }
}`,
    examples: [
      {
        title: "Hello World",
        code: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`,
      },
    ],
  },
  {
    id: "cpp",
    name: "C++",
    color: "bg-blue-500",
    description: "A powerful systems programming language offering low-level memory control and high performance.",
    syntax: `#include <iostream>
#include <vector>
#include <string>

using namespace std;

// Function
string greet(string name) {
    return "Hello, " + name + "!";
}

// Class
class Editor {
public:
    string name;
    
    Editor(string n) : name(n) {}
    
    void run() {
        cout << name << " is running..." << endl;
    }
};

int main() {
    // Variables
    string name = "CloudCode";
    double version = 1.0;
    bool isAwesome = true;
    
    // Vector (dynamic array)
    vector<string> languages = {"Python", "JavaScript", "Java"};
    for (const auto& lang : languages) {
        cout << lang << endl;
    }
    
    return 0;
}`,
    examples: [
      {
        title: "Hello World",
        code: `#include <iostream>

int main() {
    std::cout << "Hello, World!" << std::endl;
    return 0;
}`,
      },
    ],
  },
  {
    id: "go",
    name: "Go",
    color: "bg-cyan-500",
    description: "A modern, concurrent language by Google, perfect for cloud services and DevOps tools.",
    syntax: `package main

import "fmt"

// Function
func greet(name string) string {
    return fmt.Sprintf("Hello, %s!", name)
}

// Struct (similar to class)
type Editor struct {
    Name string
}

func (e Editor) Run() {
    fmt.Printf("%s is running...\n", e.Name)
}

func main() {
    // Variables
    name := "CloudCode"
    version := 1.0
    isAwesome := true
    
    fmt.Println(name, version, isAwesome)
    
    // Slice (dynamic array)
    languages := []string{"Python", "JavaScript", "Java"}
    for _, lang := range languages {
        fmt.Println(lang)
    }
}`,
    examples: [
      {
        title: "Hello World",
        code: `package main

import "fmt"

func main() {
    fmt.Println("Hello, World!")
}`,
      },
    ],
  },
  {
    id: "rust",
    name: "Rust",
    color: "bg-orange-500",
    description: "A systems language focused on safety and performance, great for WebAssembly and systems programming.",
    syntax: `// Function
fn greet(name: &str) -> String {
    format!("Hello, {}!", name)
}

// Struct
struct Editor {
    name: String,
}

impl Editor {
    fn new(name: &str) -> Self {
        Editor {
            name: name.to_string(),
        }
    }
    
    fn run(&self) {
        println!("{} is running...", self.name);
    }
}

fn main() {
    // Variables (immutable by default)
    let name = "CloudCode";
    let version: f64 = 1.0;
    let is_awesome = true;
    
    println!("{} {} {}", name, version, is_awesome);
    
    // Vector
    let languages = vec!["Python", "JavaScript", "Java"];
    for lang in &languages {
        println!("{}", lang);
    }
}`,
    examples: [
      {
        title: "Hello World",
        code: `fn main() {
    println!("Hello, World!");
}`,
      },
    ],
  },
];

export default function Documentation() {
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="container max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-4">
              <Book className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Documentation</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Learn Programming Languages
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Comprehensive guides and syntax references for all supported languages
            </p>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Language Sidebar */}
            <div className="lg:col-span-1">
              <div className="glass rounded-xl p-4 sticky top-24">
                <h3 className="font-semibold mb-4 text-sm uppercase tracking-wide text-muted-foreground">
                  Languages
                </h3>
                <div className="space-y-1">
                  {languages.map((lang) => (
                    <button
                      key={lang.id}
                      onClick={() => setSelectedLanguage(lang)}
                      className={cn(
                        "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all",
                        selectedLanguage.id === lang.id
                          ? "bg-primary/10 text-primary"
                          : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <div className={`w-3 h-3 rounded-full ${lang.color}`} />
                      <span className="font-medium">{lang.name}</span>
                      {selectedLanguage.id === lang.id && (
                        <ChevronRight className="h-4 w-4 ml-auto" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="lg:col-span-3 space-y-8">
              {/* Overview */}
              <motion.div
                key={selectedLanguage.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass rounded-xl p-6"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-12 h-12 rounded-xl ${selectedLanguage.color} flex items-center justify-center`}>
                    <Code2 className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{selectedLanguage.name}</h2>
                    <p className="text-muted-foreground">{selectedLanguage.description}</p>
                  </div>
                </div>

                {/* Syntax Section */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4">Syntax Overview</h3>
                  <div className="rounded-xl overflow-hidden bg-code-bg border border-border">
                    <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
                      <div className="w-3 h-3 rounded-full bg-destructive/80" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                      <div className="w-3 h-3 rounded-full bg-accent/80" />
                      <span className="ml-4 text-sm text-muted-foreground font-mono">
                        syntax.{selectedLanguage.id}
                      </span>
                    </div>
                    <pre className="p-4 overflow-x-auto font-mono text-sm">
                      <code className="text-foreground">{selectedLanguage.syntax}</code>
                    </pre>
                  </div>
                </div>

                {/* Examples */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Code Examples</h3>
                  <div className="space-y-4">
                    {selectedLanguage.examples.map((example, i) => (
                      <div key={i} className="rounded-xl overflow-hidden bg-code-bg border border-border">
                        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                          <span className="font-medium text-sm">{example.title}</span>
                          <a
                            href="/editor"
                            className="text-xs text-primary flex items-center gap-1 hover:underline"
                          >
                            Try it <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                        <pre className="p-4 overflow-x-auto font-mono text-sm">
                          <code className="text-foreground">{example.code}</code>
                        </pre>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
