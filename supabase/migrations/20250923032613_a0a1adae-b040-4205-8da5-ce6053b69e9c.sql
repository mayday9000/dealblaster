-- Update secure_upsert_property to avoid ambiguous address_slug using constraint name
CREATE OR REPLACE FUNCTION public.secure_upsert_property(property_data jsonb)
 RETURNS TABLE(id uuid, address text, city text, deal_type text, address_slug text, html_content text, created_at timestamp with time zone, updated_at timestamp with time zone)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  cleaned_data jsonb;
  result_id uuid;
  result_address text;
  result_city text;
  result_deal_type text;
  result_address_slug text;
  result_html_content text;
  result_created_at timestamp with time zone;
  result_updated_at timestamp with time zone;
BEGIN
  IF property_data IS NULL THEN
    RAISE EXCEPTION 'Property data cannot be null';
  END IF;

  IF NOT (property_data ? 'address' AND property_data ? 'city' AND property_data ? 'deal_type' AND property_data ? 'address_slug') THEN
    RAISE EXCEPTION 'Missing required fields: address, city, deal_type, address_slug';
  END IF;

  cleaned_data := jsonb_build_object(
    'address', TRIM(property_data->>'address'),
    'city', TRIM(property_data->>'city'),
    'deal_type', TRIM(property_data->>'deal_type'),
    'address_slug', TRIM(property_data->>'address_slug'),
    'html_content', property_data->>'html_content'
  );

  IF LENGTH(cleaned_data->>'address') = 0 OR 
     LENGTH(cleaned_data->>'city') = 0 OR 
     LENGTH(cleaned_data->>'deal_type') = 0 OR 
     LENGTH(cleaned_data->>'address_slug') = 0 THEN
    RAISE EXCEPTION 'Required fields cannot be empty';
  END IF;

  IF NOT (cleaned_data->>'address_slug' ~ '^[a-zA-Z0-9_-]+$') THEN
    RAISE EXCEPTION 'Invalid address_slug format';
  END IF;

  INSERT INTO public.properties AS p (
    address,
    city, 
    deal_type,
    address_slug,
    html_content,
    created_at,
    updated_at
  ) VALUES (
    cleaned_data->>'address',
    cleaned_data->>'city',
    cleaned_data->>'deal_type', 
    cleaned_data->>'address_slug',
    cleaned_data->>'html_content',
    now(),
    now()
  )
  ON CONFLICT ON CONSTRAINT properties_address_slug_key
  DO UPDATE SET
    address = EXCLUDED.address,
    city = EXCLUDED.city,
    deal_type = EXCLUDED.deal_type,
    html_content = EXCLUDED.html_content,
    updated_at = now()
  RETURNING 
    p.id,
    p.address,
    p.city,
    p.deal_type,
    p.address_slug,
    p.html_content,
    p.created_at,
    p.updated_at
  INTO 
    result_id,
    result_address,
    result_city,
    result_deal_type,
    result_address_slug,
    result_html_content,
    result_created_at,
    result_updated_at;

  RETURN QUERY
  SELECT 
    result_id,
    result_address,
    result_city,
    result_deal_type,
    result_address_slug,
    result_html_content,
    result_created_at,
    result_updated_at;
END;
$function$;