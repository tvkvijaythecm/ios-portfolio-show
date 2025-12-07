-- Photos table for Photo App
CREATE TABLE public.photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text,
  image_url text NOT NULL,
  link_url text,
  sort_order integer DEFAULT 0,
  is_visible boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view photos" ON public.photos FOR SELECT USING (true);
CREATE POLICY "Admins can manage photos" ON public.photos FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Videos table for Video App
CREATE TABLE public.videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text,
  video_url text NOT NULL,
  thumbnail_url text,
  sort_order integer DEFAULT 0,
  is_visible boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view videos" ON public.videos FOR SELECT USING (true);
CREATE POLICY "Admins can manage videos" ON public.videos FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Github Projects table
CREATE TABLE public.github_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  cover_image_url text,
  source_url text,
  demo_url text,
  sort_order integer DEFAULT 0,
  is_visible boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.github_projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view github projects" ON public.github_projects FOR SELECT USING (true);
CREATE POLICY "Admins can manage github projects" ON public.github_projects FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Work Experience table
CREATE TABLE public.work_experience (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name text NOT NULL,
  job_title text NOT NULL,
  job_description text,
  year_start text NOT NULL,
  year_end text,
  sort_order integer DEFAULT 0,
  is_visible boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.work_experience ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view work experience" ON public.work_experience FOR SELECT USING (true);
CREATE POLICY "Admins can manage work experience" ON public.work_experience FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Contact Settings table (Phone, WhatsApp, Mail)
CREATE TABLE public.contact_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phone_number text,
  whatsapp_number text,
  email_address text,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.contact_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view contact settings" ON public.contact_settings FOR SELECT USING (true);
CREATE POLICY "Admins can manage contact settings" ON public.contact_settings FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Insert default row
INSERT INTO public.contact_settings (phone_number, whatsapp_number, email_address) VALUES ('', '', '');

-- Social Links table (Facebook, Instagram, TikTok, X Twitter)
CREATE TABLE public.social_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  facebook_url text,
  instagram_url text,
  tiktok_url text,
  x_twitter_url text,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view social links" ON public.social_links FOR SELECT USING (true);
CREATE POLICY "Admins can manage social links" ON public.social_links FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Insert default row
INSERT INTO public.social_links (facebook_url, instagram_url, tiktok_url, x_twitter_url) VALUES ('', '', '', '');

-- Custom App Content table (HTML content for other apps)
CREATE TABLE public.custom_app_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  app_key text UNIQUE NOT NULL,
  app_name text NOT NULL,
  html_content text DEFAULT '',
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.custom_app_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view custom app content" ON public.custom_app_content FOR SELECT USING (true);
CREATE POLICY "Admins can manage custom app content" ON public.custom_app_content FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));