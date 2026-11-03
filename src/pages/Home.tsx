import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Code2, FileCode2, FolderTree, Github, Keyboard, Repeat2, TerminalSquare } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { HeroPlayground } from "@/components/HeroPlayground";
import { usePublicProjects } from "@/hooks/useProjects";

const features = [
  {
    icon: TerminalSquare,
    title: "8 languages, real execution",
    description:
      "C, C++, Java, Kotlin, JavaScript, Python, Go and Rust run on an isolated sandbox. You get stdout, stderr, exit codes and wall-clock time — not a mock.",
  },
  {
    icon: Keyboard,
    title: "Keyboard-first workflow",
    description:
      "Ctrl+Enter compiles and runs the active file. Ctrl+S saves it to the cloud. No dialogs, no mouse required.",
  },
  {
    icon: FolderTree,
    title: "Cloud workspace",
    description:
      "Organize code into folders, save files up to 10 MB each, 100 MB per account. Files reopen in the editor exactly as you left them.",
  },
  {
    icon: Repeat2,
    title: "Cross-language converter",
    description:
      "Translate a working program from Python to Rust, C to Go, or any supported pair — then run the result immediately in the editor.",
  },
  {
    icon: Github,
    title: "GitHub push",
    description:
      "Link your account and push files to a repository with commit messages, straight from the editor.",
  },
  {
    icon: FileCode2,
    title: "One-click export",
    description:
      "Download any open or saved file with its original name and extension. Works on mobile too.",
  },
];

const languages = [
  "Python",
  "JavaScript",
  "Java",
  "C++",
  "Go",
  "Rust",
  "Kotlin",
  "C",
];

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.5 },
};

export default function Home() {
  const { data: projects = [] } = usePublicProjects();
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

  const handleImageError = (id: string) => {
    setFailedImages(prev => new Set(prev).add(id));
  };

  return (
    <div className="relative overflow-hidden">
      {/* Hero */}
      <section className="relative pt-24 sm:pt-32 pb-12 sm:pb-16 px-4">
        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto text-left"
          >
            <p className="font-mono text-xs sm:text-sm text-muted-foreground mb-4">
              <span className="text-primary">$</span> cloudcode --run --lang=python,cpp,rust,go,java,kotlin,js,c
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold leading-[1.1] tracking-tight mb-5">
              A browser IDE that actually runs your code.
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground mb-8 max-w-2xl">
              No install, no signup wall. Write in 8 languages, execute on a
              real sandbox with stdin and exit codes, save to your workspace,
              and push to GitHub — from any device.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <Link to="/editor">
                <Button variant="hero" size="xl" className="group w-full sm:w-auto">
                  Open the editor
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/docs">
                <Button variant="glass" size="xl" className="w-full sm:w-auto">
                  Read the docs
                </Button>
              </Link>
            </div>
            <p className="font-mono text-xs text-muted-foreground">
              free · no credit card · <Link to="/editor" className="text-primary underline underline-offset-2">run without an account</Link>
            </p>
          </motion.div>

          {/* Live playground */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6 }}
            className="mt-10 sm:mt-14 max-w-4xl mx-auto"
          >
            <div className="flex items-center justify-between mb-2 px-1">
              <span className="font-mono text-xs text-muted-foreground">
                live — edit and run right here
              </span>
              <div className="hidden sm:flex items-center gap-2 font-mono text-xs text-muted-foreground">
                {languages.slice(0, 4).map((l) => (
                  <span key={l} className="px-2 py-0.5 rounded border border-border bg-card">
                    {l}
                  </span>
                ))}
                <span>+4</span>
              </div>
            </div>
            <HeroPlayground />
          </motion.div>
        </div>
      </section>

      {/* Languages strip */}
      <section className="border-y border-border bg-card/40 py-5 px-4">
        <div className="container flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
          <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground mr-2">
            supported
          </span>
          {languages.map((l) => (
            <span key={l} className="font-mono text-sm text-foreground/80">
              {l}
            </span>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-14 sm:py-24 px-4">
        <div className="container">
          <motion.div {...fadeUp} className="mb-10 sm:mb-16">
            <p className="font-mono text-xs uppercase tracking-widest text-primary mb-3">
              01 // capabilities
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
              Built like a tool, not a demo
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mt-3">
              Every feature here is wired to a real backend — execution, storage, conversion and Git included.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-border border border-border rounded-lg overflow-hidden">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: (i % 3) * 0.06 }}
                className="bg-card p-6 hover:bg-muted/20 transition-colors"
              >
                <feature.icon className="h-5 w-5 text-primary mb-4" strokeWidth={1.75} />
                <h3 className="text-base font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects */}
      {projects.length > 0 && (
        <section className="py-14 sm:py-24 px-4 border-t border-border">
          <div className="container">
            <motion.div {...fadeUp} className="mb-10 sm:mb-16">
              <p className="font-mono text-xs uppercase tracking-widest text-primary mb-3">
                02 // built with cloudcode
              </p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
                Projects from the community
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project, i) => (
                <motion.a
                  key={project.id}
                  href={project.project_url || '#'}
                  target={project.project_url ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ delay: (i % 3) * 0.06 }}
                  className="group rounded-lg border border-border bg-card overflow-hidden block hover:border-primary/40 transition-colors"
                >
                  <div className="w-full h-44 bg-muted/30 overflow-hidden border-b border-border">
                    {project.thumbnail_url && !failedImages.has(project.id) ? (
                      <img
                        src={project.thumbnail_url}
                        alt={project.name}
                        className="w-full h-full object-cover"
                        onError={() => handleImageError(project.id)}
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-muted-foreground font-mono text-xs">
                        no preview
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="text-base font-semibold">{project.name}</h3>
                    {project.description && (
                      <p className="text-muted-foreground text-sm mt-1.5 line-clamp-2">{project.description}</p>
                    )}
                    {project.project_url && (
                      <span className="inline-flex items-center gap-1 mt-3 font-mono text-xs text-primary">
                        visit →
                      </span>
                    )}
                  </div>
                </motion.a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-14 sm:py-24 px-4 border-t border-border">
        <div className="container">
          <motion.div {...fadeUp} className="max-w-2xl">
            <p className="font-mono text-xs uppercase tracking-widest text-primary mb-3">
              03 // get started
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Your first program is 10 seconds away
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground mb-8">
              Open the editor and hit Ctrl+Enter. Create a free account only when you want to save your work.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/editor">
                <Button variant="hero" size="xl" className="w-full sm:w-auto">
                  Start coding
                </Button>
              </Link>
              <Link to="/auth?mode=signup">
                <Button variant="glass" size="xl" className="w-full sm:w-auto">
                  Create free account
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="container">
          <div className="flex flex-col items-center gap-2 text-center md:flex-row md:justify-between md:text-left">
            <div className="flex items-center gap-2">
              <Code2 className="h-5 w-5 text-primary" />
              <span className="font-bold">CloudCode</span>
            </div>
            <p className="text-xs text-muted-foreground font-mono">
              © 2026 CloudCode · sandboxed execution · 8 languages
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
