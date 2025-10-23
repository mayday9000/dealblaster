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
    const { address } = await req.json();

    if (!address) {
      return new Response(
        JSON.stringify({ error: 'Address is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Received address:', address);

    // Format address to ATTOM Data API format
    // Convert "503 Foxdale Ridge Dr. Cary, NC 27519" to "503 FOXDALE RIDGE DR, CARY, NC 27519"
    const formattedAddress = address
      .replace(/\.\s+/g, ', ') // Replace ". " with ", "
      .toUpperCase()
      .trim();

    console.log('Formatted address:', formattedAddress);

    const attomApiKey = Deno.env.get('ATTOM_API_KEY');
    if (!attomApiKey) {
      throw new Error('ATTOM_API_KEY not configured');
    }

    // Call ATTOM Data API
    const apiUrl = `https://api.gateway.attomdata.com/propertyapi/v1.0.0/property/detail?address=${encodeURIComponent(formattedAddress)}`;
    console.log('Calling ATTOM API:', apiUrl);

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'apikey': attomApiKey,
      },
    });

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

    // Extract the required fields from the response
    const property = data.property?.[0];
    if (!property) {
      return new Response(
        JSON.stringify({ error: 'No property data found for this address' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Extract fields according to the mappings
    const extractedData = {
      bedrooms: property.building?.rooms?.bathsfull?.toString() || null,
      bathrooms: property.building?.rooms?.bathstotal?.toString() || null,
      squareFootage: property.building?.size?.livingsize?.toString() || 
                     property.building?.size?.universalsize?.toString() || 
                     property.building?.size?.bldgsize?.toString() || null,
      yearBuilt: property.summary?.yearbuilt?.toString() || null,
      lotSizeAcres: property.lot?.lotsize1 || null,
      lotSizeSqFt: property.lot?.lotsize2 || null,
      poolType: property.lot?.pooltype || null,
    };

    console.log('Extracted data:', extractedData);

    return new Response(
      JSON.stringify(extractedData),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in fetch-property-details function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
