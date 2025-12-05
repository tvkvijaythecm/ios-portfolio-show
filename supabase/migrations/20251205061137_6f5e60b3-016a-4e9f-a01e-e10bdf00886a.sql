-- Create notes table for realtime notes feature
CREATE TABLE public.notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content text NOT NULL,
  author_name text DEFAULT 'Anonymous',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;

-- Anyone can view notes
CREATE POLICY "Anyone can view notes"
ON public.notes
FOR SELECT
USING (true);

-- Anyone can add notes (public)
CREATE POLICY "Anyone can add notes"
ON public.notes
FOR INSERT
WITH CHECK (true);

-- Only admins can update notes
CREATE POLICY "Admins can update notes"
ON public.notes
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

-- Only admins can delete notes
CREATE POLICY "Admins can delete notes"
ON public.notes
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Add trigger for updated_at
CREATE TRIGGER update_notes_updated_at
BEFORE UPDATE ON public.notes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.notes;