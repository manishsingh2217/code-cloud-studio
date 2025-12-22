import { motion } from "framer-motion";
import {
  Clock,
  Code2,
  FileCode,
  FileSearch,
  MoreVertical,
  Plus,
  Search,
  Trash2,
  Upload,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

interface Project {
  id: string;
  name: string;
  language: string;
  lastEdited: string;
  size: string;
}

const mockProjects: Project[] = [
  { id: "1", name: "hello_world.py", language: "Python", lastEdited: "2 hours ago", size: "1.2 KB" },
  { id: "2", name: "api_server.js", language: "JavaScript", lastEdited: "1 day ago", size: "4.5 KB" },
  { id: "3", name: "Main.java", language: "Java", lastEdited: "3 days ago", size: "2.8 KB" },
  { id: "4", name: "algorithm.cpp", language: "C++", lastEdited: "1 week ago", size: "3.1 KB" },
  { id: "5", name: "main.go", language: "Go", lastEdited: "2 weeks ago", size: "1.9 KB" },
  { id: "6", name: "lib.rs", language: "Rust", lastEdited: "1 month ago", size: "5.2 KB" },
];

const languageColors: Record<string, string> = {
  Python: "bg-yellow-500",
  JavaScript: "bg-amber-400",
  Java: "bg-red-500",
  "C++": "bg-blue-500",
  C: "bg-gray-500",
  Go: "bg-cyan-500",
  Rust: "bg-orange-500",
  Kotlin: "bg-purple-500",
};

export default function Dashboard() {
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterLanguage, setFilterLanguage] = useState<string | null>(null);

  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = !filterLanguage || project.language === filterLanguage;
    return matchesSearch && matchesFilter;
  });

  const handleDelete = (id: string) => {
    setProjects(projects.filter((p) => p.id !== id));
    toast.success("Project deleted");
  };

  const handleNewProject = () => {
    toast.info("Create new project - Coming soon!");
  };

  const handleImport = () => {
    toast.info("Import project - Coming soon!");
  };

  const usedStorage = 18.7; // KB
  const totalStorage = 100 * 1024; // 100 MB in KB

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="container max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
              <p className="text-muted-foreground">
                Manage your saved projects and files
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="glass" onClick={handleImport}>
                <Upload className="h-4 w-4 mr-2" />
                Import
              </Button>
              <Button variant="hero" onClick={handleNewProject}>
                <Plus className="h-4 w-4 mr-2" />
                New Project
              </Button>
            </div>
          </div>

          {/* Storage Info */}
          <div className="glass rounded-xl p-6 mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <h3 className="font-semibold">Cloud Storage</h3>
              <span className="text-sm text-muted-foreground">
                {usedStorage.toFixed(1)} KB / 100 MB used
              </span>
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full gradient-bg rounded-full transition-all duration-500"
                style={{ width: `${(usedStorage / totalStorage) * 100}%` }}
              />
            </div>
          </div>

          {/* Search & Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="glass" className="min-w-[140px]">
                  <FileSearch className="h-4 w-4 mr-2" />
                  {filterLanguage || "All Languages"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setFilterLanguage(null)}>
                  All Languages
                </DropdownMenuItem>
                {Object.keys(languageColors).map((lang) => (
                  <DropdownMenuItem
                    key={lang}
                    onClick={() => setFilterLanguage(lang)}
                  >
                    <div className={`w-2 h-2 rounded-full ${languageColors[lang]} mr-2`} />
                    {lang}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Projects Grid */}
          {filteredProjects.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProjects.map((project, i) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="glass glass-hover rounded-xl p-5 group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <FileCode className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium truncate max-w-[150px]">
                          {project.name}
                        </h4>
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-2 h-2 rounded-full ${languageColors[project.language]}`}
                          />
                          <span className="text-xs text-muted-foreground">
                            {project.language}
                          </span>
                        </div>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Code2 className="h-4 w-4 mr-2" />
                          Open in Editor
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleDelete(project.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {project.lastEdited}
                    </div>
                    <span>{project.size}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <FileCode className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No projects found</h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery
                  ? "Try adjusting your search or filter"
                  : "Create your first project to get started"}
              </p>
              <Button variant="hero" onClick={handleNewProject}>
                <Plus className="h-4 w-4 mr-2" />
                Create Project
              </Button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
