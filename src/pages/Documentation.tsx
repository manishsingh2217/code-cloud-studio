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
        print(f"{self.name} is running...")

# List Comprehensions
squares = [x**2 for x in range(10)]

# Dictionary
user = {"name": "John", "age": 25}

# Exception Handling
try:
    result = 10 / 0
except ZeroDivisionError:
    print("Cannot divide by zero!")`,
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
      {
        title: "Read User Input",
        code: `name = input("Enter your name: ")
age = int(input("Enter your age: "))
print(f"Hello {name}, you are {age} years old!")`,
      },
      {
        title: "File Operations",
        code: `# Writing to a file
with open("example.txt", "w") as f:
    f.write("Hello, File!")

# Reading from a file
with open("example.txt", "r") as f:
    content = f.read()
    print(content)`,
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
}

// Promises and Async/Await
async function fetchData() {
    try {
        const response = await fetch('https://api.example.com');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
    }
}

// Destructuring
const { name: userName, age } = { name: "John", age: 25 };
const [first, second] = [1, 2];`,
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

console.log("Doubled:", doubled);
console.log("Evens:", evens);
console.log("Sum:", sum);`,
      },
      {
        title: "Object Manipulation",
        code: `const person = {
    name: "Alice",
    age: 30,
    city: "NYC"
};

// Object destructuring
const { name, age } = person;
console.log(\`\${name} is \${age} years old\`);

// Spread operator
const updated = { ...person, age: 31 };
console.log(updated);`,
      },
      {
        title: "Promises",
        code: `const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function countdown() {
    for (let i = 3; i > 0; i--) {
        console.log(i);
        await delay(1000);
    }
    console.log("Go!");
}

countdown();`,
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
        
        // ArrayList
        ArrayList<Integer> numbers = new ArrayList<>();
        numbers.add(1);
        numbers.add(2);
        
        // Lambda expressions (Java 8+)
        numbers.forEach(n -> System.out.println(n));
    }
    
    public static String greet(String name) {
        return "Hello, " + name + "!";
    }
}

// Class with constructor
class Person {
    private String name;
    private int age;
    
    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }
    
    public String getName() {
        return name;
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
      {
        title: "Read User Input",
        code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        
        System.out.print("Enter your name: ");
        String name = scanner.nextLine();
        
        System.out.print("Enter your age: ");
        int age = scanner.nextInt();
        
        System.out.println("Hello " + name + ", you are " + age + " years old!");
        scanner.close();
    }
}`,
      },
      {
        title: "Factorial Calculation",
        code: `public class Main {
    public static void main(String[] args) {
        int n = 5;
        long factorial = 1;
        
        for (int i = 1; i <= n; i++) {
            factorial *= i;
        }
        
        System.out.println("Factorial of " + n + " = " + factorial);
    }
}`,
      },
      {
        title: "Object-Oriented Example",
        code: `class Animal {
    protected String name;
    
    public Animal(String name) {
        this.name = name;
    }
    
    public void speak() {
        System.out.println(name + " makes a sound");
    }
}

class Dog extends Animal {
    public Dog(String name) {
        super(name);
    }
    
    @Override
    public void speak() {
        System.out.println(name + " barks!");
    }
}

public class Main {
    public static void main(String[] args) {
        Animal dog = new Dog("Buddy");
        dog.speak();
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
#include <memory>

using namespace std;

// Function
string greet(const string& name) {
    return "Hello, " + name + "!";
}

// Class
class Editor {
public:
    string name;
    
    Editor(const string& n) : name(n) {}
    
    void run() {
        cout << name << " is running..." << endl;
    }
};

// Template function
template <typename T>
T add(T a, T b) {
    return a + b;
}

int main() {
    // Variables
    string name = "CloudCode";
    double version = 1.0;
    bool isAwesome = true;
    
    // Smart pointers (C++11)
    auto editor = make_unique<Editor>("CloudCode");
    editor->run();
    
    // Vector (dynamic array)
    vector<string> languages = {"Python", "JavaScript", "Java"};
    for (const auto& lang : languages) {
        cout << lang << endl;
    }
    
    // Lambda expressions
    auto square = [](int x) { return x * x; };
    cout << square(5) << endl;
    
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
      {
        title: "User Input",
        code: `#include <iostream>
#include <string>

using namespace std;

int main() {
    string name;
    int age;
    
    cout << "Enter your name: ";
    getline(cin, name);
    
    cout << "Enter your age: ";
    cin >> age;
    
    cout << "Hello " << name << ", you are " << age << " years old!" << endl;
    
    return 0;
}`,
      },
      {
        title: "Pointers and Memory",
        code: `#include <iostream>

using namespace std;

int main() {
    int value = 42;
    int* ptr = &value;
    
    cout << "Value: " << value << endl;
    cout << "Address: " << ptr << endl;
    cout << "Dereferenced: " << *ptr << endl;
    
    // Dynamic memory
    int* arr = new int[5];
    for (int i = 0; i < 5; i++) {
        arr[i] = i * 10;
        cout << arr[i] << " ";
    }
    cout << endl;
    
    delete[] arr;
    
    return 0;
}`,
      },
      {
        title: "STL Containers",
        code: `#include <iostream>
#include <vector>
#include <map>
#include <algorithm>

using namespace std;

int main() {
    // Vector
    vector<int> nums = {5, 2, 8, 1, 9};
    sort(nums.begin(), nums.end());
    
    cout << "Sorted: ";
    for (int n : nums) cout << n << " ";
    cout << endl;
    
    // Map
    map<string, int> ages;
    ages["Alice"] = 25;
    ages["Bob"] = 30;
    
    for (const auto& [name, age] : ages) {
        cout << name << ": " << age << endl;
    }
    
    return 0;
}`,
      },
    ],
  },
  {
    id: "c",
    name: "C",
    color: "bg-gray-500",
    description: "The foundational systems programming language, known for its efficiency and direct hardware access.",
    syntax: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

// Function declaration
int add(int a, int b);
void greet(const char* name);

// Struct
struct Person {
    char name[50];
    int age;
};

int main() {
    // Variables
    int number = 42;
    float decimal = 3.14;
    char character = 'A';
    char string[] = "Hello";
    
    // Pointers
    int* ptr = &number;
    printf("Value: %d, Address: %p\\n", *ptr, (void*)ptr);
    
    // Arrays
    int numbers[5] = {1, 2, 3, 4, 5};
    for (int i = 0; i < 5; i++) {
        printf("%d ", numbers[i]);
    }
    printf("\\n");
    
    // Dynamic memory
    int* arr = (int*)malloc(5 * sizeof(int));
    if (arr != NULL) {
        for (int i = 0; i < 5; i++) {
            arr[i] = i * 10;
        }
        free(arr);
    }
    
    // Struct usage
    struct Person person;
    strcpy(person.name, "John");
    person.age = 25;
    
    return 0;
}

int add(int a, int b) {
    return a + b;
}

void greet(const char* name) {
    printf("Hello, %s!\\n", name);
}`,
    examples: [
      {
        title: "Hello World",
        code: `#include <stdio.h>

int main() {
    printf("Hello, World!\\n");
    return 0;
}`,
      },
      {
        title: "User Input",
        code: `#include <stdio.h>

int main() {
    char name[50];
    int age;
    
    printf("Enter your name: ");
    scanf("%s", name);
    
    printf("Enter your age: ");
    scanf("%d", &age);
    
    printf("Hello %s, you are %d years old!\\n", name, age);
    
    return 0;
}`,
      },
      {
        title: "Array Operations",
        code: `#include <stdio.h>

int main() {
    int numbers[] = {5, 2, 8, 1, 9};
    int size = sizeof(numbers) / sizeof(numbers[0]);
    int sum = 0;
    
    // Calculate sum
    for (int i = 0; i < size; i++) {
        sum += numbers[i];
    }
    
    printf("Sum: %d\\n", sum);
    printf("Average: %.2f\\n", (float)sum / size);
    
    return 0;
}`,
      },
      {
        title: "Linked List",
        code: `#include <stdio.h>
#include <stdlib.h>

struct Node {
    int data;
    struct Node* next;
};

void printList(struct Node* head) {
    while (head != NULL) {
        printf("%d -> ", head->data);
        head = head->next;
    }
    printf("NULL\\n");
}

int main() {
    struct Node* head = malloc(sizeof(struct Node));
    struct Node* second = malloc(sizeof(struct Node));
    struct Node* third = malloc(sizeof(struct Node));
    
    head->data = 1;
    head->next = second;
    
    second->data = 2;
    second->next = third;
    
    third->data = 3;
    third->next = NULL;
    
    printList(head);
    
    free(head);
    free(second);
    free(third);
    
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

import (
    "fmt"
    "sync"
)

// Function
func greet(name string) string {
    return fmt.Sprintf("Hello, %s!", name)
}

// Struct (similar to class)
type Editor struct {
    Name string
}

func (e Editor) Run() {
    fmt.Printf("%s is running...\\n", e.Name)
}

// Interface
type Runner interface {
    Run()
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
    
    // Map
    ages := map[string]int{
        "Alice": 25,
        "Bob":   30,
    }
    
    for name, age := range ages {
        fmt.Printf("%s is %d\\n", name, age)
    }
    
    // Goroutines (concurrency)
    var wg sync.WaitGroup
    wg.Add(2)
    
    go func() {
        defer wg.Done()
        fmt.Println("Goroutine 1")
    }()
    
    go func() {
        defer wg.Done()
        fmt.Println("Goroutine 2")
    }()
    
    wg.Wait()
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
      {
        title: "User Input",
        code: `package main

import (
    "bufio"
    "fmt"
    "os"
)

func main() {
    reader := bufio.NewReader(os.Stdin)
    
    fmt.Print("Enter your name: ")
    name, _ := reader.ReadString('\\n')
    
    fmt.Printf("Hello, %s", name)
}`,
      },
      {
        title: "Error Handling",
        code: `package main

import (
    "errors"
    "fmt"
)

func divide(a, b float64) (float64, error) {
    if b == 0 {
        return 0, errors.New("cannot divide by zero")
    }
    return a / b, nil
}

func main() {
    result, err := divide(10, 2)
    if err != nil {
        fmt.Println("Error:", err)
        return
    }
    fmt.Println("Result:", result)
    
    _, err = divide(10, 0)
    if err != nil {
        fmt.Println("Error:", err)
    }
}`,
      },
      {
        title: "Goroutines & Channels",
        code: `package main

import (
    "fmt"
    "time"
)

func worker(id int, jobs <-chan int, results chan<- int) {
    for j := range jobs {
        fmt.Printf("Worker %d processing job %d\\n", id, j)
        time.Sleep(100 * time.Millisecond)
        results <- j * 2
    }
}

func main() {
    jobs := make(chan int, 5)
    results := make(chan int, 5)
    
    // Start 3 workers
    for w := 1; w <= 3; w++ {
        go worker(w, jobs, results)
    }
    
    // Send 5 jobs
    for j := 1; j <= 5; j++ {
        jobs <- j
    }
    close(jobs)
    
    // Collect results
    for a := 1; a <= 5; a++ {
        fmt.Println("Result:", <-results)
    }
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

// Enum
enum Status {
    Active,
    Inactive,
    Pending(String),
}

// Trait (interface)
trait Runnable {
    fn run(&self);
}

fn main() {
    // Variables (immutable by default)
    let name = "CloudCode";
    let version: f64 = 1.0;
    let is_awesome = true;
    
    println!("{} {} {}", name, version, is_awesome);
    
    // Mutable variable
    let mut counter = 0;
    counter += 1;
    
    // Vector
    let languages = vec!["Python", "JavaScript", "Java"];
    for lang in &languages {
        println!("{}", lang);
    }
    
    // Option type
    let some_number: Option<i32> = Some(42);
    if let Some(n) = some_number {
        println!("Number: {}", n);
    }
    
    // Result type for error handling
    let result: Result<i32, &str> = Ok(42);
    match result {
        Ok(value) => println!("Value: {}", value),
        Err(e) => println!("Error: {}", e),
    }
}`,
    examples: [
      {
        title: "Hello World",
        code: `fn main() {
    println!("Hello, World!");
}`,
      },
      {
        title: "User Input",
        code: `use std::io;

fn main() {
    println!("Enter your name:");
    
    let mut name = String::new();
    io::stdin()
        .read_line(&mut name)
        .expect("Failed to read line");
    
    println!("Hello, {}!", name.trim());
}`,
      },
      {
        title: "Ownership & Borrowing",
        code: `fn main() {
    // Ownership
    let s1 = String::from("hello");
    let s2 = s1; // s1 is moved, no longer valid
    println!("{}", s2);
    
    // Borrowing (reference)
    let s3 = String::from("world");
    let len = calculate_length(&s3);
    println!("Length of '{}' is {}", s3, len);
    
    // Mutable reference
    let mut s4 = String::from("hello");
    change(&mut s4);
    println!("{}", s4);
}

fn calculate_length(s: &String) -> usize {
    s.len()
}

fn change(s: &mut String) {
    s.push_str(", world!");
}`,
      },
      {
        title: "Pattern Matching",
        code: `enum Coin {
    Penny,
    Nickel,
    Dime,
    Quarter,
}

fn value_in_cents(coin: Coin) -> u8 {
    match coin {
        Coin::Penny => 1,
        Coin::Nickel => 5,
        Coin::Dime => 10,
        Coin::Quarter => 25,
    }
}

fn main() {
    let coins = [Coin::Penny, Coin::Quarter, Coin::Dime];
    
    for coin in coins {
        println!("Value: {} cents", value_in_cents(coin));
    }
    
    // if let for simple matching
    let number = Some(7);
    if let Some(n) = number {
        println!("Number is {}", n);
    }
}`,
      },
    ],
  },
  {
    id: "kotlin",
    name: "Kotlin",
    color: "bg-purple-500",
    description: "A modern, concise language for Android and JVM development with excellent Java interoperability.",
    syntax: `// Main function
fun main() {
    // Variables
    val name = "CloudCode"  // Immutable
    var version = 1.0       // Mutable
    val isAwesome = true
    
    println("$name $version $isAwesome")
    
    // Null safety
    var nullable: String? = null
    println(nullable?.length ?: "null")
    
    // Lists
    val languages = listOf("Python", "JavaScript", "Java")
    languages.forEach { println(it) }
    
    // Mutable list
    val mutableList = mutableListOf(1, 2, 3)
    mutableList.add(4)
    
    // Maps
    val ages = mapOf("Alice" to 25, "Bob" to 30)
    ages.forEach { (name, age) ->
        println("$name is $age years old")
    }
    
    // Data class
    data class Person(val name: String, val age: Int)
    val person = Person("John", 25)
    println(person)
    
    // Extension function
    fun String.addExclamation() = "$this!"
    println("Hello".addExclamation())
    
    // Lambda
    val double = { x: Int -> x * 2 }
    println(double(5))
    
    // Higher-order function
    val numbers = listOf(1, 2, 3, 4, 5)
    val doubled = numbers.map { it * 2 }
    println(doubled)
}

// Function with default parameter
fun greet(name: String = "World"): String {
    return "Hello, $name!"
}

// Class
class Editor(val name: String) {
    fun run() {
        println("$name is running...")
    }
}`,
    examples: [
      {
        title: "Hello World",
        code: `fun main() {
    println("Hello, World!")
}`,
      },
      {
        title: "User Input",
        code: `fun main() {
    print("Enter your name: ")
    val name = readLine() ?: "Unknown"
    
    print("Enter your age: ")
    val age = readLine()?.toIntOrNull() ?: 0
    
    println("Hello $name, you are $age years old!")
}`,
      },
      {
        title: "Null Safety",
        code: `fun main() {
    // Nullable type
    var name: String? = "Alice"
    println(name?.length)  // Safe call
    
    name = null
    println(name?.length ?: "Name is null")  // Elvis operator
    
    // Not-null assertion (use carefully!)
    val nonNullName: String = name ?: "Default"
    println(nonNullName)
    
    // Safe casting
    val obj: Any = "Hello"
    val str: String? = obj as? String
    println(str?.uppercase())
}`,
      },
      {
        title: "Collections & Lambdas",
        code: `data class Person(val name: String, val age: Int)

fun main() {
    val people = listOf(
        Person("Alice", 29),
        Person("Bob", 31),
        Person("Charlie", 25)
    )
    
    // Filter and map
    val youngPeople = people
        .filter { it.age < 30 }
        .map { it.name }
    println("Young: $youngPeople")
    
    // Sorting
    val sorted = people.sortedBy { it.age }
    println("By age: ${sorted.map { it.name }}")
    
    // Grouping
    val byAge = people.groupBy { if (it.age >= 30) "30+" else "Under 30" }
    println("Grouped: $byAge")
    
    // Reduce
    val totalAge = people.sumOf { it.age }
    println("Total age: $totalAge")
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
                    <pre className="p-4 overflow-x-auto font-mono text-sm max-h-[500px] overflow-y-auto">
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
