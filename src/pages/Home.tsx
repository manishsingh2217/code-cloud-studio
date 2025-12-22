import { motion } from "framer-motion";
import {
  ArrowRight,
  Code2,
  Cpu,
  FileCode2,
  GitBranch,
  Layers,
  Play,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Code2,
    title: "Multi-Language Support",
    description:
      "Write and execute code in C, C++, Java, Python, JavaScript, Go, Rust, and Kotlin.",
  },
  {
    icon: Play,
    title: "Instant Execution",
    description:
      "Run your code instantly in a secure sandbox environment with real-time output.",
  },
  {
    icon: Layers,
    title: "Code Conversion",
    description:
      "Convert code between languages seamlessly with our AI-powered converter.",
  },
  {
    icon: GitBranch,
    title: "GitHub Integration",
    description:
      "Push your code directly to GitHub repositories with commit support.",
  },
  {
    icon: Cpu,
    title: "Cloud Storage",
    description:
      "Save your projects to the cloud with 100MB free storage per user.",
  },
  {
    icon: FileCode2,
    title: "Rich Documentation",
    description:
      "Access comprehensive documentation for all supported languages.",
  },
];

const languages = [
  { name: "Python", color: "bg-yellow-500" },
  { name: "JavaScript", color: "bg-amber-400" },
  { name: "Java", color: "bg-red-500" },
  { name: "C++", color: "bg-blue-500" },
  { name: "Go", color: "bg-cyan-500" },
  { name: "Rust", color: "bg-orange-500" },
  { name: "Kotlin", color: "bg-purple-500" },
  { name: "C", color: "bg-gray-500" },
];

export default function Home() {
  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center py-20 px-4">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-grid-pattern opacity-50" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse-glow animation-delay-1000" />

        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            {/* Badge */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8"
            >
              <Zap className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">
                Cloud-based coding for everyone
              </span>
            </motion.div>

            {/* Headline */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Code anywhere.
              <br />
              <span className="gradient-text">Build everything.</span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              A powerful cloud IDE with instant execution, multi-language
              support, and seamless GitHub integration. Start coding in seconds.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link to="/editor">
                <Button variant="hero" size="xl" className="group">
                  Start Coding
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/docs">
                <Button variant="glass" size="xl">
                  View Documentation
                </Button>
              </Link>
            </div>

            {/* Language Pills */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap justify-center gap-3"
            >
              {languages.map((lang, i) => (
                <motion.div
                  key={lang.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + i * 0.1 }}
                  className="flex items-center gap-2 px-4 py-2 rounded-full glass hover:scale-105 transition-transform cursor-default"
                >
                  <div className={`w-3 h-3 rounded-full ${lang.color}`} />
                  <span className="text-sm font-medium">{lang.name}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Code Preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="mt-20 max-w-4xl mx-auto"
          >
            <div className="glass rounded-2xl overflow-hidden shadow-2xl">
              {/* Editor Header */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border/50 bg-card/50">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-destructive/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-accent/80" />
                </div>
                <span className="ml-4 text-sm text-muted-foreground font-mono">
                  main.py
                </span>
              </div>
              {/* Code Content */}
              <div className="p-6 font-mono text-sm bg-code-bg">
                <pre className="text-foreground">
                  <code>
                    <span className="text-purple-500">def</span>{" "}
                    <span className="text-primary">hello_cloud</span>():
                    {"\n"}
                    {"    "}
                    <span className="text-muted-foreground"># Welcome to CloudCode</span>
                    {"\n"}
                    {"    "}message = <span className="text-accent">"Hello, World!"</span>
                    {"\n"}
                    {"    "}
                    <span className="text-purple-500">print</span>(message)
                    {"\n"}
                    {"\n"}
                    hello_cloud()
                  </code>
                </pre>
              </div>
              {/* Output */}
              <div className="px-6 py-4 border-t border-border/50 bg-card/30">
                <div className="flex items-center gap-2 mb-2">
                  <Play className="h-4 w-4 text-accent" />
                  <span className="text-xs text-muted-foreground uppercase tracking-wide">
                    Output
                  </span>
                </div>
                <code className="text-sm text-accent font-mono">
                  Hello, World!
                </code>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything you need to code
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Powerful features designed for developers of all skill levels
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group p-6 rounded-2xl glass glass-hover"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden"
          >
            <div className="absolute inset-0 gradient-bg opacity-10" />
            <div className="relative glass p-12 md:p-20 text-center">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                Ready to start coding?
              </h2>
              <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
                Join thousands of developers building with CloudCode. Free to
                start, powerful enough to scale.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/auth?mode=signup">
                  <Button variant="hero" size="xl">
                    Create Free Account
                  </Button>
                </Link>
                <Link to="/editor">
                  <Button variant="glass" size="xl">
                    Try Without Account
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-border/50">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Code2 className="h-6 w-6 text-primary" />
              <span className="font-bold gradient-text">CloudCode</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 CloudCode. Built for developers, by developers.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
