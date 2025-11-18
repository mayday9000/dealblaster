-- Create waitlist_signups table
CREATE TABLE public.waitlist_signups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.waitlist_signups ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (public waitlist signup)
CREATE POLICY "Anyone can sign up for waitlist"
ON public.waitlist_signups
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Create index on email for faster lookups
CREATE INDEX idx_waitlist_signups_email ON public.waitlist_signups(email);

-- Create index on created_at for sorting
CREATE INDEX idx_waitlist_signups_created_at ON public.waitlist_signups(created_at DESC);