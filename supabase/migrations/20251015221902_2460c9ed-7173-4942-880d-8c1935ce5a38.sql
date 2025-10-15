-- Add user_id column to properties table
ALTER TABLE public.properties 
ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Create index for performance
CREATE INDEX idx_properties_user_id ON public.properties(user_id);

-- Drop old permissive policies
DROP POLICY IF EXISTS "Anyone can create properties" ON public.properties;
DROP POLICY IF EXISTS "Authenticated users can update properties" ON public.properties;

-- Create secure, user-specific policies
CREATE POLICY "Authenticated users can create properties" 
ON public.properties 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own properties" 
ON public.properties 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own properties" 
ON public.properties 
FOR DELETE 
TO authenticated
USING (auth.uid() = user_id);

-- Update secure_upsert_property function to capture user_id
CREATE OR REPLACE FUNCTION public.secure_upsert_property(property_data jsonb)
RETURNS TABLE(id uuid, address text, city text, deal_type text, address_slug text, html_content text, created_at timestamp with time zone, updated_at timestamp with time zone)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  result_id uuid;
  result_address text;
  result_city text;
  result_deal_type text;
  result_address_slug text;
  result_html_content text;
  result_created_at timestamp with time zone;
  result_updated_at timestamp with time zone;
  current_user_id uuid;
BEGIN
  -- Ensure user is authenticated
  current_user_id := auth.uid();
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  IF property_data IS NULL THEN
    RAISE EXCEPTION 'Property data cannot be null';
  END IF;

  IF NOT (property_data ? 'address' AND property_data ? 'city' AND property_data ? 'deal_type' AND property_data ? 'address_slug') THEN
    RAISE EXCEPTION 'Missing required fields: address, city, deal_type, address_slug';
  END IF;

  INSERT INTO public.properties (
    user_id,
    address, city, deal_type, address_slug, html_content,
    state, zip, hook, generated_titles, selected_title, is_premarket,
    apn, asking_price, financing_types, financing_other, closing_date, closing_date_type,
    photo_link, front_photo,
    is_land, land_condition, road_frontage, road_frontage_unit,
    bedrooms, bathrooms, square_footage, year_built, zoning, 
    lot_size, lot_size_unit, foundation_type, utilities, utilities_other,
    parking_spaces, parking_type, pool, pool_type,
    big_ticket_items, current_occupancy, closing_occupancy,
    include_financial_breakdown, arv, rehab_estimate, all_in, gross_profit, exit_strategy,
    include_one_percent_rule, comps,
    contact_name, contact_phone, contact_email, office_number, business_hours, 
    contact_image, company_logo, website,
    emd_amount, emd_due_date, post_possession, additional_disclosures,
    include_buy_hold_snapshot, buy_hold_type, buy_hold_purchase_price, buy_hold_rehab_cost,
    buy_hold_monthly_rent, buy_hold_monthly_taxes, buy_hold_monthly_insurance,
    buy_hold_other_expenses, buy_hold_mortgage_payment, buy_hold_cash_to_seller,
    created_at, updated_at
  ) VALUES (
    current_user_id,
    TRIM(property_data->>'address'),
    TRIM(property_data->>'city'),
    TRIM(property_data->>'deal_type'),
    TRIM(property_data->>'address_slug'),
    property_data->>'html_content',
    property_data->>'state',
    property_data->>'zip',
    property_data->>'hook',
    CASE WHEN property_data ? 'generated_titles' THEN 
      ARRAY(SELECT jsonb_array_elements_text(property_data->'generated_titles'))
    ELSE NULL END,
    property_data->>'selected_title',
    COALESCE((property_data->>'is_premarket')::boolean, false),
    property_data->>'apn',
    property_data->>'asking_price',
    CASE WHEN property_data ? 'financing_types' THEN 
      ARRAY(SELECT jsonb_array_elements_text(property_data->'financing_types'))
    ELSE NULL END,
    property_data->>'financing_other',
    property_data->>'closing_date',
    property_data->>'closing_date_type',
    property_data->>'photo_link',
    property_data->>'front_photo',
    COALESCE((property_data->>'is_land')::boolean, false),
    property_data->>'land_condition',
    property_data->>'road_frontage',
    property_data->>'road_frontage_unit',
    property_data->>'bedrooms',
    property_data->>'bathrooms',
    property_data->>'square_footage',
    property_data->>'year_built',
    property_data->>'zoning',
    property_data->>'lot_size',
    property_data->>'lot_size_unit',
    property_data->>'foundation_type',
    COALESCE(property_data->'utilities', '[]'::jsonb),
    property_data->>'utilities_other',
    property_data->>'parking_spaces',
    property_data->>'parking_type',
    COALESCE((property_data->>'pool')::boolean, false),
    property_data->>'pool_type',
    COALESCE(property_data->'big_ticket_items', '[]'::jsonb),
    property_data->>'current_occupancy',
    property_data->>'closing_occupancy',
    COALESCE((property_data->>'include_financial_breakdown')::boolean, false),
    property_data->>'arv',
    property_data->>'rehab_estimate',
    property_data->>'all_in',
    property_data->>'gross_profit',
    property_data->>'exit_strategy',
    COALESCE((property_data->>'include_one_percent_rule')::boolean, false),
    COALESCE(property_data->'comps', '[]'::jsonb),
    property_data->>'contact_name',
    property_data->>'contact_phone',
    property_data->>'contact_email',
    property_data->>'office_number',
    property_data->>'business_hours',
    property_data->>'contact_image',
    property_data->>'company_logo',
    property_data->>'website',
    property_data->>'emd_amount',
    property_data->>'emd_due_date',
    property_data->>'post_possession',
    property_data->>'additional_disclosures',
    COALESCE((property_data->>'include_buy_hold_snapshot')::boolean, false),
    property_data->>'buy_hold_type',
    property_data->>'buy_hold_purchase_price',
    property_data->>'buy_hold_rehab_cost',
    property_data->>'buy_hold_monthly_rent',
    property_data->>'buy_hold_monthly_taxes',
    property_data->>'buy_hold_monthly_insurance',
    property_data->>'buy_hold_other_expenses',
    property_data->>'buy_hold_mortgage_payment',
    property_data->>'buy_hold_cash_to_seller',
    now(),
    now()
  )
  ON CONFLICT ON CONSTRAINT properties_address_slug_key
  DO UPDATE SET
    address = EXCLUDED.address,
    city = EXCLUDED.city,
    deal_type = EXCLUDED.deal_type,
    html_content = EXCLUDED.html_content,
    state = EXCLUDED.state,
    zip = EXCLUDED.zip,
    hook = EXCLUDED.hook,
    generated_titles = EXCLUDED.generated_titles,
    selected_title = EXCLUDED.selected_title,
    is_premarket = EXCLUDED.is_premarket,
    apn = EXCLUDED.apn,
    asking_price = EXCLUDED.asking_price,
    financing_types = EXCLUDED.financing_types,
    financing_other = EXCLUDED.financing_other,
    closing_date = EXCLUDED.closing_date,
    closing_date_type = EXCLUDED.closing_date_type,
    photo_link = EXCLUDED.photo_link,
    front_photo = EXCLUDED.front_photo,
    is_land = EXCLUDED.is_land,
    land_condition = EXCLUDED.land_condition,
    road_frontage = EXCLUDED.road_frontage,
    road_frontage_unit = EXCLUDED.road_frontage_unit,
    bedrooms = EXCLUDED.bedrooms,
    bathrooms = EXCLUDED.bathrooms,
    square_footage = EXCLUDED.square_footage,
    year_built = EXCLUDED.year_built,
    zoning = EXCLUDED.zoning,
    lot_size = EXCLUDED.lot_size,
    lot_size_unit = EXCLUDED.lot_size_unit,
    foundation_type = EXCLUDED.foundation_type,
    utilities = EXCLUDED.utilities,
    utilities_other = EXCLUDED.utilities_other,
    parking_spaces = EXCLUDED.parking_spaces,
    parking_type = EXCLUDED.parking_type,
    pool = EXCLUDED.pool,
    pool_type = EXCLUDED.pool_type,
    big_ticket_items = EXCLUDED.big_ticket_items,
    current_occupancy = EXCLUDED.current_occupancy,
    closing_occupancy = EXCLUDED.closing_occupancy,
    include_financial_breakdown = EXCLUDED.include_financial_breakdown,
    arv = EXCLUDED.arv,
    rehab_estimate = EXCLUDED.rehab_estimate,
    all_in = EXCLUDED.all_in,
    gross_profit = EXCLUDED.gross_profit,
    exit_strategy = EXCLUDED.exit_strategy,
    include_one_percent_rule = EXCLUDED.include_one_percent_rule,
    comps = EXCLUDED.comps,
    contact_name = EXCLUDED.contact_name,
    contact_phone = EXCLUDED.contact_phone,
    contact_email = EXCLUDED.contact_email,
    office_number = EXCLUDED.office_number,
    business_hours = EXCLUDED.business_hours,
    contact_image = EXCLUDED.contact_image,
    company_logo = EXCLUDED.company_logo,
    website = EXCLUDED.website,
    emd_amount = EXCLUDED.emd_amount,
    emd_due_date = EXCLUDED.emd_due_date,
    post_possession = EXCLUDED.post_possession,
    additional_disclosures = EXCLUDED.additional_disclosures,
    include_buy_hold_snapshot = EXCLUDED.include_buy_hold_snapshot,
    buy_hold_type = EXCLUDED.buy_hold_type,
    buy_hold_purchase_price = EXCLUDED.buy_hold_purchase_price,
    buy_hold_rehab_cost = EXCLUDED.buy_hold_rehab_cost,
    buy_hold_monthly_rent = EXCLUDED.buy_hold_monthly_rent,
    buy_hold_monthly_taxes = EXCLUDED.buy_hold_monthly_taxes,
    buy_hold_monthly_insurance = EXCLUDED.buy_hold_monthly_insurance,
    buy_hold_other_expenses = EXCLUDED.buy_hold_other_expenses,
    buy_hold_mortgage_payment = EXCLUDED.buy_hold_mortgage_payment,
    buy_hold_cash_to_seller = EXCLUDED.buy_hold_cash_to_seller,
    updated_at = now()
  WHERE properties.user_id = current_user_id
  RETURNING 
    properties.id,
    properties.address,
    properties.city,
    properties.deal_type,
    properties.address_slug,
    properties.html_content,
    properties.created_at,
    properties.updated_at
  INTO 
    result_id,
    result_address,
    result_city,
    result_deal_type,
    result_address_slug,
    result_html_content,
    result_created_at,
    result_updated_at;

  IF result_id IS NULL THEN
    RAISE EXCEPTION 'You can only update properties you own';
  END IF;

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