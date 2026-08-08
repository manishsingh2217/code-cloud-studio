ALTER TABLE public.user_files
  ADD CONSTRAINT check_file_size CHECK (size_bytes >= 0 AND size_bytes <= 10485760),
  ADD CONSTRAINT check_file_name_length CHECK (char_length(name) > 0 AND char_length(name) <= 255),
  ADD CONSTRAINT check_code_size CHECK (octet_length(code) <= 10485760);