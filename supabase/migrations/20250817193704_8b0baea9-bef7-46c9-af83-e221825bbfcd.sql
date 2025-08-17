-- Create properties table for storing all form data
CREATE TABLE public.properties (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  address_slug TEXT NOT NULL UNIQUE,
  
  -- Listing Headline
  city TEXT,
  deal_type TEXT,
  hook TEXT,
  generated_titles TEXT[],
  selected_title TEXT,
  
  -- Basic Info
  address TEXT,
  asking_price TEXT,
  financing_types TEXT[],
  closing_date TEXT,
  
  -- Photo Section
  photo_link TEXT,
  front_photo TEXT, -- base64 encoded
  
  -- Property Overview
  bedrooms TEXT,
  bathrooms TEXT,
  square_footage TEXT,
  year_built TEXT,
  zoning TEXT,
  lot_size TEXT,
  foundation_type TEXT,
  utilities TEXT[],
  garage TEXT,
  pool BOOLEAN DEFAULT false,
  
  -- Big Ticket Systems
  roof_age TEXT,
  roof_specific_age TEXT,
  roof_last_serviced TEXT,
  roof_condition TEXT,
  hvac_age TEXT,
  hvac_specific_age TEXT,
  hvac_last_serviced TEXT,
  hvac_condition TEXT,
  water_heater_age TEXT,
  water_heater_specific_age TEXT,
  water_heater_last_serviced TEXT,
  water_heater_condition TEXT,
  
  -- Occupancy
  current_occupancy TEXT,
  closing_occupancy TEXT,
  
  -- Financial Snapshot
  include_financial_breakdown BOOLEAN DEFAULT false,
  arv TEXT,
  rehab_estimate TEXT,
  all_in TEXT,
  gross_profit TEXT,
  exit_strategy TEXT,
  
  -- Comps (stored as JSONB)
  comps JSONB,
  
  -- Contact Info
  contact_name TEXT,
  contact_phone TEXT,
  contact_email TEXT,
  office_number TEXT,
  business_hours TEXT,
  contact_image TEXT, -- base64 encoded
  website TEXT,
  
  -- Legal Disclosures
  memo_filed BOOLEAN DEFAULT false,
  emd_amount TEXT,
  emd_due_date TEXT,
  post_possession BOOLEAN DEFAULT false,
  additional_disclosures TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access (for shareable URLs)
CREATE POLICY "Properties are publicly viewable" 
ON public.properties 
FOR SELECT 
USING (true);

-- Create policy to allow public insert (anyone can create properties)
CREATE POLICY "Anyone can create properties" 
ON public.properties 
FOR INSERT 
WITH CHECK (true);

-- Create policy to allow public update (for editing properties)
CREATE POLICY "Anyone can update properties" 
ON public.properties 
FOR UPDATE 
USING (true);

-- Create trigger for automatic timestamp updates
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_properties_updated_at
BEFORE UPDATE ON public.properties
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for address_slug lookups
CREATE INDEX idx_properties_address_slug ON public.properties(address_slug);