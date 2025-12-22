import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface UserFile {
  id: string;
  name: string;
  language: string;
  code: string;
  size_bytes: number;
  created_at: string;
  updated_at: string;
}

export function useUserFiles() {
  const { user } = useAuth();
  const [files, setFiles] = useState<UserFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalSize, setTotalSize] = useState(0);

  const fetchFiles = async () => {
    if (!user) {
      setFiles([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_files')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;

      const typedData = (data || []) as UserFile[];
      setFiles(typedData);
      setTotalSize(typedData.reduce((acc, file) => acc + file.size_bytes, 0));
    } catch (error) {
      console.error('Error fetching files:', error);
      toast.error('Failed to load files');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [user]);

  const saveFile = async (name: string, language: string, code: string, existingId?: string) => {
    if (!user) {
      toast.error('Please sign in to save files');
      return null;
    }

    try {
      const sizeBytes = new Blob([code]).size;

      if (existingId) {
        const { data, error } = await supabase
          .from('user_files')
          .update({ name, language, code, size_bytes: sizeBytes })
          .eq('id', existingId)
          .select()
          .single();

        if (error) throw error;
        await fetchFiles();
        return data as UserFile;
      } else {
        const { data, error } = await supabase
          .from('user_files')
          .insert({
            user_id: user.id,
            name,
            language,
            code,
            size_bytes: sizeBytes,
          })
          .select()
          .single();

        if (error) throw error;
        await fetchFiles();
        return data as UserFile;
      }
    } catch (error: any) {
      console.error('Error saving file:', error);
      toast.error(error.message || 'Failed to save file');
      return null;
    }
  };

  const deleteFile = async (id: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('user_files')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchFiles();
      return true;
    } catch (error) {
      console.error('Error deleting file:', error);
      toast.error('Failed to delete file');
      return false;
    }
  };

  return {
    files,
    loading,
    totalSize,
    saveFile,
    deleteFile,
    refetch: fetchFiles,
  };
}
