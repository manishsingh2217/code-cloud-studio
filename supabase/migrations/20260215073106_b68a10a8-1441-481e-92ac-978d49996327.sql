
-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Anyone can view all projects" ON public.projects;

-- Create a restricted policy for featured projects only
CREATE POLICY "Public can view featured projects"
ON public.projects FOR SELECT
USING (is_featured = true);
