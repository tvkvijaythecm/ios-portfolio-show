-- Create info_app_settings table for the Info App content
CREATE TABLE public.info_app_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  app_name TEXT NOT NULL DEFAULT 'SNetOS',
  version TEXT NOT NULL DEFAULT '1.5',
  codebase TEXT NOT NULL DEFAULT 'Javascript',
  established_year TEXT NOT NULL DEFAULT '2024',
  license TEXT NOT NULL DEFAULT 'SNet Cloud Nexus',
  origin TEXT NOT NULL DEFAULT 'Kuala Lumpur, MY',
  privacy_label TEXT NOT NULL DEFAULT 'Privacy Policy',
  license_label TEXT NOT NULL DEFAULT 'GNU AGPLv3',
  logs_label TEXT NOT NULL DEFAULT 'System Logs',
  acknowledgements_label TEXT NOT NULL DEFAULT 'Acknowledgements',
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.info_app_settings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view info app settings" 
ON public.info_app_settings 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage info app settings" 
ON public.info_app_settings 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Insert default row
INSERT INTO public.info_app_settings (app_name, version, codebase, established_year, license, origin)
VALUES ('SNetOS', '1.5', 'Javascript', '2024', 'SNet Cloud Nexus', 'Kuala Lumpur, MY');