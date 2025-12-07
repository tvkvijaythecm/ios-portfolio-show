-- Add html_content column to case_study_apps table
ALTER TABLE public.case_study_apps 
ADD COLUMN html_content text DEFAULT '';
