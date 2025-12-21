-- Add HTML content columns for privacy and license pages
ALTER TABLE public.info_app_settings 
ADD COLUMN privacy_html_content TEXT DEFAULT '',
ADD COLUMN license_html_content TEXT DEFAULT '';

-- Remove the logs and acknowledgements label columns since we're removing those menus
ALTER TABLE public.info_app_settings 
DROP COLUMN IF EXISTS logs_label,
DROP COLUMN IF EXISTS acknowledgements_label;