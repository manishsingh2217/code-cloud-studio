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
  folder_path: string;
  created_at: string;
  updated_at: string;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB per file
const MAX_TOTAL_SIZE = 100 * 1024 * 1024; // 100MB total per user
const MAX_NAME_LENGTH = 255;

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

  const saveFile = async (name: string, language: string, code: string, existingId?: string, folderPath: string = '/') => {
    if (!user) {
      toast.error('Please sign in to save files');
      return null;
    }

    const trimmedName = name.trim();
    if (!trimmedName || trimmedName.length > MAX_NAME_LENGTH) {
      toast.error('Please provide a file name under 255 characters.');
      return null;
    }

    const sizeBytes = new Blob([code]).size;

    if (sizeBytes > MAX_FILE_SIZE) {
      toast.error('File is too large. Maximum size is 10MB.');
      return null;
    }

    const previousSize = existingId
      ? files.find((f) => f.id === existingId)?.size_bytes || 0
      : 0;
    if (totalSize - previousSize + sizeBytes > MAX_TOTAL_SIZE) {
      toast.error('Storage quota exceeded. Maximum is 100MB per account.');
      return null;
    }

    try {


      if (existingId) {
        const { data, error } = await supabase
          .from('user_files')
          .update({ name, language, code, size_bytes: sizeBytes, folder_path: folderPath })
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
            folder_path: folderPath,
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

  const getFolders = (): string[] => {
    const folderSet = new Set<string>();
    files.forEach(file => {
      if (file.folder_path && file.folder_path !== '/') {
        const parts = file.folder_path.split('/').filter(Boolean);
        let current = '';
        parts.forEach(part => {
          current += '/' + part;
          folderSet.add(current);
        });
      }
    });
    return Array.from(folderSet).sort();
  };

  return {
    files,
    loading,
    totalSize,
    saveFile,
    deleteFile,
    getFolders,
    refetch: fetchFiles,
  };
}
