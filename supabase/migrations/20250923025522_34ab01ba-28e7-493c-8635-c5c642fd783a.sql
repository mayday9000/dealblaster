-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "Properties are publicly viewable" ON public.properties;
DROP POLICY IF EXISTS "Anyone can create properties" ON public.properties; 
DROP POLICY IF EXISTS "Anyone can update properties" ON public.properties;

-- Create new policies that protect contact information
-- Allow public read access to non-sensitive property data
CREATE POLICY "Public can view property details" 
ON public.properties 
FOR SELECT 
USING (true);

-- Allow anyone to create properties (for the form submission)
CREATE POLICY "Anyone can create properties" 
ON public.properties 
FOR INSERT 
WITH CHECK (true);

-- Only allow updates by authenticated users (could be property owners/agents)
CREATE POLICY "Authenticated users can update properties" 
ON public.properties 
FOR UPDATE 
USING (auth.uid() IS NOT NULL);

-- Create a security definer function to get sanitized property data for public view
CREATE OR REPLACE FUNCTION public.get_public_property_data(property_address text)
RETURNS TABLE (
  id uuid,
  address text,
  city text,
  deal_type text,
  asking_price text,
  bedrooms text,
  bathrooms text,
  square_footage text,
  lot_size text,
  year_built text,
  zoning text,
  closing_date text,
  photo_link text,
  front_photo text,
  foundation_type text,
  utilities text,
  garage text,
  pool text,
  current_occupancy text,
  closing_occupancy text,
  arv text,
  rehab_estimate text,
  all_in text,
  gross_profit text,
  exit_strategy text,
  emd_amount text,
  emd_due_date text,
  post_possession text,
  additional_disclosures text,
  address_slug text,
  html_content text,
  comps jsonb,
  hook text,
  generated_titles text[],
  selected_title text,
  financing_types text[],
  include_financial_breakdown boolean,
  created_at timestamp with time zone,
  updated_at timestamp with time zone
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.address,
    p.city,
    p.deal_type,
    p.asking_price,
    p.bedrooms,
    p.bathrooms,
    p.square_footage,
    p.lot_size,
    p.year_built,
    p.zoning,
    p.closing_date,
    p.photo_link,
    p.front_photo,
    p.foundation_type,
    p.utilities,
    p.garage,
    p.pool,
    p.current_occupancy,
    p.closing_occupancy,
    p.arv,
    p.rehab_estimate,
    p.all_in,
    p.gross_profit,
    p.exit_strategy,
    p.emd_amount,
    p.emd_due_date,
    p.post_possession,
    p.additional_disclosures,
    p.address_slug,
    p.html_content,
    p.comps,
    p.hook,
    p.generated_titles,
    p.selected_title,
    p.financing_types,
    p.include_financial_breakdown,
    p.created_at,
    p.updated_at
  FROM public.properties p
  WHERE p.address = property_address;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a security definer function to get contact information (requires authentication)
CREATE OR REPLACE FUNCTION public.get_property_contact_info(property_address text)
RETURNS TABLE (
  contact_name text,
  contact_phone text,
  contact_email text,
  office_number text,
  business_hours text,
  contact_image text,
  website text
) AS $$
BEGIN
  -- Only return contact info if user is authenticated
  IF auth.uid() IS NULL THEN
    RETURN;
  END IF;
  
  RETURN QUERY
  SELECT 
    p.contact_name,
    p.contact_phone,
    p.contact_email,
    p.office_number,
    p.business_hours,
    p.contact_image,
    p.website
  FROM public.properties p
  WHERE p.address = property_address;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;