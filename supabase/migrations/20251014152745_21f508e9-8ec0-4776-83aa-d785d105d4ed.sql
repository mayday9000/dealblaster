-- Phase 1: Add new columns to properties table
ALTER TABLE public.properties 
ADD COLUMN IF NOT EXISTS state text,
ADD COLUMN IF NOT EXISTS zip text,
ADD COLUMN IF NOT EXISTS apn text,
ADD COLUMN IF NOT EXISTS financing_other text,
ADD COLUMN IF NOT EXISTS closing_date_type text,
ADD COLUMN IF NOT EXISTS is_premarket boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS is_land boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS land_condition text,
ADD COLUMN IF NOT EXISTS road_frontage text,
ADD COLUMN IF NOT EXISTS road_frontage_unit text,
ADD COLUMN IF NOT EXISTS lot_size_unit text,
ADD COLUMN IF NOT EXISTS utilities_other text,
ADD COLUMN IF NOT EXISTS parking_spaces text,
ADD COLUMN IF NOT EXISTS parking_type text,
ADD COLUMN IF NOT EXISTS pool_type text,
ADD COLUMN IF NOT EXISTS big_ticket_items jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS include_one_percent_rule boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS include_buy_hold_snapshot boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS buy_hold_type text,
ADD COLUMN IF NOT EXISTS buy_hold_purchase_price text,
ADD COLUMN IF NOT EXISTS buy_hold_rehab_cost text,
ADD COLUMN IF NOT EXISTS buy_hold_monthly_rent text,
ADD COLUMN IF NOT EXISTS buy_hold_monthly_taxes text,
ADD COLUMN IF NOT EXISTS buy_hold_monthly_insurance text,
ADD COLUMN IF NOT EXISTS buy_hold_other_expenses text,
ADD COLUMN IF NOT EXISTS buy_hold_mortgage_payment text,
ADD COLUMN IF NOT EXISTS buy_hold_cash_to_seller text,
ADD COLUMN IF NOT EXISTS company_logo text;

-- Phase 2: Modify pool column only if it's text type
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'properties' 
    AND column_name = 'pool' 
    AND data_type = 'text'
  ) THEN
    ALTER TABLE public.properties 
    ALTER COLUMN pool TYPE boolean USING (
      CASE 
        WHEN pool IS NULL THEN false
        WHEN LOWER(pool) IN ('yes', 'true', '1') THEN true
        ELSE false
      END
    );
  END IF;
END $$;

-- Phase 3: Modify utilities column only if it's text type
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'properties' 
    AND column_name = 'utilities' 
    AND data_type = 'text'
  ) THEN
    ALTER TABLE public.properties 
    ALTER COLUMN utilities TYPE jsonb USING (
      CASE 
        WHEN utilities IS NULL OR utilities = '' THEN '[]'::jsonb
        ELSE jsonb_build_array(utilities)
      END
    );
  END IF;
END $$;

-- Phase 4: Drop obsolete column if exists
ALTER TABLE public.properties DROP COLUMN IF EXISTS garage;

-- Phase 5: Drop and recreate get_public_property_data function with new signature
DROP FUNCTION IF EXISTS public.get_public_property_data(text);

CREATE FUNCTION public.get_public_property_data(property_address text)
RETURNS TABLE(
  id uuid, address text, city text, deal_type text, address_slug text, html_content text,
  state text, zip text, hook text, generated_titles text[], selected_title text, is_premarket boolean,
  apn text, asking_price text, financing_types text[], financing_other text, 
  closing_date text, closing_date_type text,
  photo_link text, front_photo text,
  is_land boolean, land_condition text, road_frontage text, road_frontage_unit text,
  bedrooms text, bathrooms text, square_footage text, year_built text, zoning text,
  lot_size text, lot_size_unit text, foundation_type text, utilities jsonb, utilities_other text,
  parking_spaces text, parking_type text, pool boolean, pool_type text,
  big_ticket_items jsonb, current_occupancy text, closing_occupancy text,
  include_financial_breakdown boolean, arv text, rehab_estimate text, all_in text, 
  gross_profit text, exit_strategy text,
  include_one_percent_rule boolean, comps jsonb,
  emd_amount text, emd_due_date text, post_possession text, additional_disclosures text,
  include_buy_hold_snapshot boolean, buy_hold_type text, buy_hold_purchase_price text,
  buy_hold_rehab_cost text, buy_hold_monthly_rent text, buy_hold_monthly_taxes text,
  buy_hold_monthly_insurance text, buy_hold_other_expenses text, buy_hold_mortgage_payment text,
  buy_hold_cash_to_seller text,
  created_at timestamp with time zone, updated_at timestamp with time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id, p.address, p.city, p.deal_type, p.address_slug, p.html_content,
    p.state, p.zip, p.hook, p.generated_titles, p.selected_title, p.is_premarket,
    p.apn, p.asking_price, p.financing_types, p.financing_other, 
    p.closing_date, p.closing_date_type,
    p.photo_link, p.front_photo,
    p.is_land, p.land_condition, p.road_frontage, p.road_frontage_unit,
    p.bedrooms, p.bathrooms, p.square_footage, p.year_built, p.zoning,
    p.lot_size, p.lot_size_unit, p.foundation_type, p.utilities, p.utilities_other,
    p.parking_spaces, p.parking_type, p.pool, p.pool_type,
    p.big_ticket_items, p.current_occupancy, p.closing_occupancy,
    p.include_financial_breakdown, p.arv, p.rehab_estimate, p.all_in, 
    p.gross_profit, p.exit_strategy,
    p.include_one_percent_rule, p.comps,
    p.emd_amount, p.emd_due_date, p.post_possession, p.additional_disclosures,
    p.include_buy_hold_snapshot, p.buy_hold_type, p.buy_hold_purchase_price,
    p.buy_hold_rehab_cost, p.buy_hold_monthly_rent, p.buy_hold_monthly_taxes,
    p.buy_hold_monthly_insurance, p.buy_hold_other_expenses, p.buy_hold_mortgage_payment,
    p.buy_hold_cash_to_seller,
    p.created_at, p.updated_at
  FROM public.properties p
  WHERE p.address = property_address;
END;
$$;

-- Phase 6: Replace secure_upsert_property function to handle all fields
CREATE OR REPLACE FUNCTION public.secure_upsert_property(property_data jsonb)
RETURNS TABLE(id uuid, address text, city text, deal_type text, address_slug text, html_content text, created_at timestamp with time zone, updated_at timestamp with time zone)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
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

  INSERT INTO public.properties (
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
$$;