import { motion } from "framer-motion";
import {
  Clock,
  Code2,
  FileCode,
  FileSearch,
  Loader2,
  MoreVertical,
  Plus,
  Search,
  Trash2,
  Upload,
} from "lucide-react";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useUserFiles } from "@/hooks/useUserFiles";
import { formatDistanceToNow } from "date-fns";

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

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { files, loading, totalSize, deleteFile, saveFile } = useUserFiles();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [filterLanguage, setFilterLanguage] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredFiles = files.filter((file) => {
    const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = !filterLanguage || file.language === filterLanguage;
    return matchesSearch && matchesFilter;
  });

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    const success = await deleteFile(id);
    if (success) {
      toast.success("File deleted");
    }
    setDeletingId(null);
  };

  const handleNewProject = () => {
    navigate('/editor');
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!user) {
      toast.error("Please sign in to import files");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      const code = event.target?.result as string;
      const extension = file.name.split('.').pop()?.toLowerCase();
      
      const languageMap: Record<string, string> = {
        py: 'Python',
        js: 'JavaScript',
        java: 'Java',
        cpp: 'C++',
        c: 'C',
        go: 'Go',
        rs: 'Rust',
        kt: 'Kotlin',
      };

      const language = languageMap[extension || ''] || 'Python';
      
      const result = await saveFile(file.name, language, code);
      if (result) {
        toast.success("File imported successfully!");
      }
    };
    reader.readAsText(file);
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleOpenInEditor = (file: typeof files[0]) => {
    // Store file data in sessionStorage to load in editor
    sessionStorage.setItem('openFile', JSON.stringify(file));
    navigate('/editor');
  };

  const totalStorageMB = 100 * 1024 * 1024; // 100 MB in bytes
  const usagePercentage = (totalSize / totalStorageMB) * 100;

  if (!user) {
    return (
      <div className="min-h-screen bg-background py-8 px-4">
        <div className="container max-w-6xl mx-auto text-center py-20">
          <FileCode className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Sign in to view your dashboard</h3>
          <p className="text-muted-foreground mb-6">
            Create an account to save and manage your code files
          </p>
          <Button variant="hero" onClick={() => navigate('/auth')}>
            Sign In
          </Button>
        </div>
      </div>
    );
  }

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
              <Button 
                variant="glass" 
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-4 w-4 mr-2" />
                Import
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleImport}
                accept=".py,.js,.java,.cpp,.c,.go,.rs,.kt"
              />
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
                {formatBytes(totalSize)} / 100 MB used
              </span>
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full gradient-bg rounded-full transition-all duration-500"
                style={{ width: `${Math.min(usagePercentage, 100)}%` }}
              />
            </div>
          </div>

          {/* Search & Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search files..."
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

          {/* Loading State */}
          {loading ? (
            <div className="text-center py-20">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
              <p className="text-muted-foreground mt-4">Loading your files...</p>
            </div>
          ) : filteredFiles.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredFiles.map((file, i) => (
                <motion.div
                  key={file.id}
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
                          {file.name}
                        </h4>
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-2 h-2 rounded-full ${languageColors[file.language] || 'bg-gray-500'}`}
                          />
                          <span className="text-xs text-muted-foreground">
                            {file.language}
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
                        <DropdownMenuItem onClick={() => handleOpenInEditor(file)}>
                          <Code2 className="h-4 w-4 mr-2" />
                          Open in Editor
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleDelete(file.id)}
                          disabled={deletingId === file.id}
                        >
                          {deletingId === file.id ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4 mr-2" />
                          )}
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDistanceToNow(new Date(file.updated_at), { addSuffix: true })}
                    </div>
                    <span>{formatBytes(file.size_bytes)}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <FileCode className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No files found</h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery
                  ? "Try adjusting your search or filter"
                  : "Create your first file to get started"}
              </p>
              <Button variant="hero" onClick={handleNewProject}>
                <Plus className="h-4 w-4 mr-2" />
                Create File
              </Button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
