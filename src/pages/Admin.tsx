import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, ExternalLink, Image, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/useAuth';
import { useProjects, Project } from '@/hooks/useProjects';
import { Navigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface ProjectForm {
  name: string;
  description: string;
  thumbnail_url: string;
  project_url: string;
  is_featured: boolean;
}

const emptyForm: ProjectForm = { name: '', description: '', thumbnail_url: '', project_url: '', is_featured: false };

export default function Admin() {
  const { user, loading: authLoading } = useAuth();
  const { projects, isLoading, createProject, updateProject, deleteProject } = useProjects();
  const { toast } = useToast();
  const [form, setForm] = useState<ProjectForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [thumbnailError, setThumbnailError] = useState(false);

  if (authLoading) return <div className="flex items-center justify-center min-h-[60vh] text-muted-foreground">Loading...</div>;
  if (!user) return <Navigate to="/auth" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast({ title: 'Error', description: 'Project name is required', variant: 'destructive' });
      return;
    }
    try {
      if (editingId) {
        await updateProject.mutateAsync({ id: editingId, ...form });
        toast({ title: 'Updated', description: 'Project updated successfully' });
      } else {
        await createProject.mutateAsync(form);
        toast({ title: 'Created', description: 'Project created successfully' });
      }
      setForm(emptyForm);
      setEditingId(null);
      setShowForm(false);
      setThumbnailError(false);
    } catch {
      toast({ title: 'Error', description: 'Failed to save project', variant: 'destructive' });
    }
  };

  const startEdit = (p: Project) => {
    setForm({
      name: p.name,
      description: p.description || '',
      thumbnail_url: p.thumbnail_url || '',
      project_url: p.project_url || '',
      is_featured: p.is_featured,
    });
    setEditingId(p.id);
    setShowForm(true);
    setThumbnailError(false);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProject.mutateAsync(id);
      toast({ title: 'Deleted', description: 'Project deleted successfully' });
    } catch {
      toast({ title: 'Error', description: 'Failed to delete project', variant: 'destructive' });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Admin Panel</h1>
            <p className="text-muted-foreground mt-1">Manage your projects</p>
          </div>
          <Button
            variant="hero"
            onClick={() => { setForm(emptyForm); setEditingId(null); setShowForm(!showForm); setThumbnailError(false); }}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Project
          </Button>
        </div>

        {/* Form */}
        {showForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mb-8">
            <form onSubmit={handleSubmit} className="glass rounded-2xl p-6 space-y-4">
              <h2 className="text-xl font-semibold">{editingId ? 'Edit Project' : 'New Project'}</h2>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Project Name *</label>
                  <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="My Project" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Project URL</label>
                  <Input value={form.project_url} onChange={e => setForm({ ...form, project_url: e.target.value })} placeholder="https://myproject.com" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="A brief description..." rows={3} />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Thumbnail URL</label>
                <Input
                  value={form.thumbnail_url}
                  onChange={e => { setForm({ ...form, thumbnail_url: e.target.value }); setThumbnailError(false); }}
                  placeholder="https://example.com/image.png"
                />
                {/* Thumbnail Preview */}
                {form.thumbnail_url && (
                  <div className="mt-2 rounded-xl overflow-hidden border border-border/50 bg-muted/30 max-w-xs">
                    {thumbnailError ? (
                      <div className="flex flex-col items-center justify-center h-40 text-destructive gap-2">
                        <Image className="h-8 w-8" />
                        <p className="text-sm">Failed to load image. Check the URL.</p>
                      </div>
                    ) : (
                      <img
                        src={form.thumbnail_url}
                        alt="Thumbnail preview"
                        className="w-full h-40 object-cover"
                        onError={() => setThumbnailError(true)}
                      />
                    )}
                  </div>
                )}
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.is_featured} onChange={e => setForm({ ...form, is_featured: e.target.checked })} className="rounded" />
                <Star className="h-4 w-4 text-primary" />
                <span className="text-sm">Featured project</span>
              </label>

              <div className="flex gap-3">
                <Button type="submit" variant="hero" disabled={createProject.isPending || updateProject.isPending}>
                  {editingId ? 'Update' : 'Create'} Project
                </Button>
                <Button type="button" variant="ghost" onClick={() => { setShowForm(false); setEditingId(null); setForm(emptyForm); }}>
                  Cancel
                </Button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Projects List */}
        {isLoading ? (
          <p className="text-muted-foreground text-center py-12">Loading projects...</p>
        ) : projects.length === 0 ? (
          <div className="text-center py-16 glass rounded-2xl">
            <Image className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-lg font-medium">No projects yet</p>
            <p className="text-muted-foreground">Click "Add Project" to create your first one.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {projects.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass rounded-xl p-4 flex gap-4 items-start"
              >
                {/* Thumbnail */}
                <div className="w-24 h-24 rounded-lg overflow-hidden bg-muted/30 border border-border/50 flex-shrink-0">
                  {p.thumbnail_url ? (
                    <img
                      src={p.thumbnail_url}
                      alt={p.name}
                      className="w-full h-full object-cover"
                      onError={e => {
                        (e.target as HTMLImageElement).style.display = 'none';
                        (e.target as HTMLImageElement).parentElement!.innerHTML = '<div class="flex items-center justify-center h-full text-muted-foreground"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg></div>';
                      }}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      <Image className="h-6 w-6" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold truncate">{p.name}</h3>
                    {p.is_featured && <Star className="h-4 w-4 text-primary fill-primary flex-shrink-0" />}
                  </div>
                  {p.description && <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{p.description}</p>}
                  {p.project_url && (
                    <a href={p.project_url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline flex items-center gap-1 mt-1">
                      <ExternalLink className="h-3 w-3" /> {p.project_url}
                    </a>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-1 flex-shrink-0">
                  <Button variant="ghost" size="icon" onClick={() => startEdit(p)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(p.id)} className="text-destructive hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
