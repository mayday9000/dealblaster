import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse request body with error handling
    let address;
    try {
      const body = await req.json();
      address = body.address;
    } catch (parseError) {
      console.error('Failed to parse request body:', parseError);
      return new Response(
        JSON.stringify({ error: 'Invalid request body' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!address) {
      return new Response(
        JSON.stringify({ error: 'Address is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Received address:', address);

    // Parse address into address1 (street) and address2 (city, state)
    const addressParts = address.split(',').map((part: string) => part.trim());
    
    if (addressParts.length < 2) {
      return new Response(
        JSON.stringify({ error: 'Address must include street, city, and state (e.g., "4529 Winona Court, Denver, CO")' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const address1 = addressParts[0];
    const address2 = addressParts.slice(1).join(', ');

    console.log('Parsed address1:', address1);
    console.log('Parsed address2:', address2);

    const attomApiKey = '80d6d645feeb1f76c4126ed1703ef791';
    const apiUrl = `https://api.gateway.attomdata.com/propertyapi/v1.0.0/property/basicprofile?address1=${encodeURIComponent(address1)}&address2=${encodeURIComponent(address2)}`;
    console.log('Calling ATTOM API:', apiUrl);

    // Add timeout handling for ATTOM API call
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 50000); // 50 second timeout

    let response;
    try {
      response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'apikey': attomApiKey,
        },
        signal: controller.signal
      });
      clearTimeout(timeoutId);
    } catch (fetchError) {
      clearTimeout(timeoutId);
      if (fetchError.name === 'AbortError') {
        console.error('ATTOM API request timed out');
        return new Response(
          JSON.stringify({ error: 'ATTOM API request timed out after 50 seconds' }),
          { status: 504, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      console.error('ATTOM API fetch error:', fetchError);
      return new Response(
        JSON.stringify({ error: `Failed to fetch from ATTOM API: ${fetchError.message}` }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error('ATTOM API error:', response.status, errorText);
      return new Response(
        JSON.stringify({ error: `ATTOM API error: ${response.status}` }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    console.log('ATTOM API response received');

    const property = data.property?.[0];
    if (!property) {
      return new Response(
        JSON.stringify({ error: 'No property data found for this address' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const extractedData = {
      bedrooms: property.building?.rooms?.beds?.toString() || null,
      bathrooms: property.building?.rooms?.bathsTotal?.toString() || null,
      bathsFull: property.building?.rooms?.bathsFull?.toString() || null,
      squareFootage: property.building?.size?.livingSize?.toString() || null,
      yearBuilt: property.summary?.yearBuilt?.toString() || null,
      zoning: property.lot?.zoningType || null,
      lotSizeAcres: property.lot?.lotSize1 || null,
      lotSizeSqFt: property.lot?.lotSize2 || null,
      addressOneLine: property.address?.oneLine || null,
      addressLine1: property.address?.line1 || null,
      addressLocality: property.address?.locality || null,
      addressCountrySubd: property.address?.countrySubd || null,
      addressPostal1: property.address?.postal1 || null,
      salePrice: property.sale?.saleAmountData?.saleAmt?.toString() || null,
      saleTransDate: property.sale?.saleTransDate || null,
      saleRecDate: property.sale?.saleAmountData?.saleRecDate || null,
    };

    console.log('Extracted data:', extractedData);

    return new Response(
      JSON.stringify(extractedData),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Unhandled error in fetch-property-details:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'An unexpected error occurred',
        details: error.toString()
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
