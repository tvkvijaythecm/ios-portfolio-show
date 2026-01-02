-- Drop the overly permissive policies for write operations
DROP POLICY IF EXISTS "Anyone can create calendar notes" ON public.calendar_notes;
DROP POLICY IF EXISTS "Anyone can update calendar notes" ON public.calendar_notes;
DROP POLICY IF EXISTS "Anyone can delete calendar notes" ON public.calendar_notes;

-- Create new policies that restrict write operations to admins only
CREATE POLICY "Admins can create calendar notes" 
ON public.calendar_notes 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update calendar notes" 
ON public.calendar_notes 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete calendar notes" 
ON public.calendar_notes 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));