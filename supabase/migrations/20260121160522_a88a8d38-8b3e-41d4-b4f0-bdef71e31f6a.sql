-- Add technologies column for tech stack tags
ALTER TABLE public.github_projects 
ADD COLUMN IF NOT EXISTS technologies text[] DEFAULT '{}';