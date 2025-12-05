-- Create enum for app roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table for admin management
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS policies for user_roles
CREATE POLICY "Admins can view all roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage roles"
ON public.user_roles FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- App Settings table (global settings)
CREATE TABLE public.app_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view settings"
ON public.app_settings FOR SELECT USING (true);

CREATE POLICY "Admins can update settings"
ON public.app_settings FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- App Items table (dynamic apps in grid)
CREATE TABLE public.app_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  icon_url TEXT,
  icon_type TEXT DEFAULT 'lucide',
  lucide_icon TEXT,
  gradient TEXT NOT NULL DEFAULT 'from-blue-500 to-purple-600',
  app_type TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  is_dock_item BOOLEAN NOT NULL DEFAULT false,
  external_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.app_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view visible apps"
ON public.app_items FOR SELECT USING (true);

CREATE POLICY "Admins can manage apps"
ON public.app_items FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- About Content table
CREATE TABLE public.about_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_image TEXT,
  name TEXT NOT NULL DEFAULT 'Suresh',
  title TEXT DEFAULT 'UI/UX Designer',
  followers INTEGER DEFAULT 1200,
  experience_years INTEGER DEFAULT 5,
  about_text TEXT,
  skills JSONB DEFAULT '[]',
  technologies JSONB DEFAULT '[]',
  social_links JSONB DEFAULT '[]',
  carousel_images JSONB DEFAULT '[]',
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.about_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view about content"
ON public.about_content FOR SELECT USING (true);

CREATE POLICY "Admins can update about content"
ON public.about_content FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Education/Credentials table
CREATE TABLE public.education_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  issuer TEXT NOT NULL,
  year TEXT,
  image_url TEXT,
  category TEXT NOT NULL DEFAULT 'institute',
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.education_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view education items"
ON public.education_items FOR SELECT USING (true);

CREATE POLICY "Admins can manage education items"
ON public.education_items FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Case Study Apps table
CREATE TABLE public.case_study_apps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  icon_url TEXT,
  gradient TEXT NOT NULL DEFAULT 'from-blue-500 to-purple-600',
  embed_url TEXT,
  description TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.case_study_apps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view case studies"
ON public.case_study_apps FOR SELECT USING (true);

CREATE POLICY "Admins can manage case studies"
ON public.case_study_apps FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Insert default app settings
INSERT INTO public.app_settings (key, value) VALUES
('background', '{"type": "image", "value": "/assets/homescreen-bg.jpg"}'),
('boot', '{"logo": "/assets/boot-logo.svg", "duration": 3000, "progressColor": "white"}'),
('welcome', '{"enabled": true, "text": "Hello", "subtext": "Welcome to my portfolio", "duration": 5000}'),
('control_centre', '{"showTorch": true, "showWeather": true, "showInfo": true, "showReboot": true}'),
('profile', '{"name": "Suresh", "title": "UI/UX Designer"}');

-- Insert default about content
INSERT INTO public.about_content (name, title, followers, experience_years, about_text) VALUES
('Suresh', 'UI/UX Designer', 1200, 5, 'A passionate designer who loves creating beautiful user experiences.');

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_app_settings_updated_at
BEFORE UPDATE ON public.app_settings
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_app_items_updated_at
BEFORE UPDATE ON public.app_items
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_about_content_updated_at
BEFORE UPDATE ON public.about_content
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();