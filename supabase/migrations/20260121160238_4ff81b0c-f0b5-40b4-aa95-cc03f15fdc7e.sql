-- Add detail_content column for project detail pages
ALTER TABLE public.github_projects 
ADD COLUMN IF NOT EXISTS detail_content text DEFAULT '';