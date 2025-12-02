-- Create calendar_notes table
CREATE TABLE IF NOT EXISTS public.calendar_notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  note TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.calendar_notes ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (no authentication required)
CREATE POLICY "Anyone can view calendar notes" 
ON public.calendar_notes 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can create calendar notes" 
ON public.calendar_notes 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update calendar notes" 
ON public.calendar_notes 
FOR UPDATE 
USING (true);

CREATE POLICY "Anyone can delete calendar notes" 
ON public.calendar_notes 
FOR DELETE 
USING (true);

-- Create index for faster date lookups
CREATE INDEX IF NOT EXISTS idx_calendar_notes_date ON public.calendar_notes(date);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_calendar_notes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_calendar_notes_updated_at
BEFORE UPDATE ON public.calendar_notes
FOR EACH ROW
EXECUTE FUNCTION public.update_calendar_notes_updated_at();

-- Enable realtime
ALTER TABLE public.calendar_notes REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.calendar_notes;