-- Create properties table to store all form data and generated HTML
CREATE TABLE public.properties (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  address_slug TEXT NOT NULL UNIQUE,
  html_content TEXT,
  
  -- Listing details
  city TEXT NOT NULL,
  deal_type TEXT NOT NULL,
  hook TEXT,
  generated_titles TEXT[],
  selected_title TEXT,
  address TEXT NOT NULL,
  asking_price TEXT,
  financing_types TEXT[],
  
  -- Property overview
  property_type TEXT,
  building_size TEXT,
  lot_size TEXT,
  year_built TEXT,
  units TEXT,
  occupancy TEXT,
  zoning TEXT,
  parking TEXT,
  
  -- Big ticket items
  big_ticket_items JSONB DEFAULT '[]'::jsonb,
  
  -- Financial details
  gross_scheduled_income TEXT,
  operating_expenses TEXT,
  net_operating_income TEXT,
  cap_rate TEXT,
  cash_on_cash_return TEXT,
  
  -- Comps
  comps JSONB DEFAULT '[]'::jsonb,
  
  -- Contact info
  contact_name TEXT,
  contact_phone TEXT,
  contact_email TEXT,
  brokerage TEXT,
  
  -- Legal disclosures
  additional_disclosures TEXT,
  
  -- Photos (store as base64 strings)
  primary_photo TEXT,
  additional_photos TEXT[],
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access (since this is a public listing app)
CREATE POLICY "Properties are publicly viewable" 
ON public.properties 
FOR SELECT 
USING (true);

-- Create policy to allow public insert (for creating new listings)
CREATE POLICY "Anyone can create properties" 
ON public.properties 
FOR INSERT 
WITH CHECK (true);

-- Create policy to allow public updates (for updating listings)
CREATE POLICY "Anyone can update properties" 
ON public.properties 
FOR UPDATE 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_properties_updated_at
  BEFORE UPDATE ON public.properties
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create index on address_slug for fast lookups
CREATE INDEX idx_properties_address_slug ON public.properties(address_slug);