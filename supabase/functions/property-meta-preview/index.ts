import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.75.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!;

// Create Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Detect if the request is from a link preview crawler
function isCrawler(userAgent: string | null): boolean {
  if (!userAgent) return false;
  
  const crawlerPatterns = [
    /WhatsApp/i,
    /facebookexternalhit/i,
    /Twitterbot/i,
    /LinkedInBot/i,
    /Slackbot/i,
    /Discordbot/i,
    /TelegramBot/i,
    /iMessageBot/i,
    /SkypeUriPreview/i,
    /vkShare/i,
  ];
  
  return crawlerPatterns.some(pattern => pattern.test(userAgent));
}

// Generate HTML with Open Graph meta tags
function generateMetaHtml(property: any, fullUrl: string): string {
  const title = `${property.address}, ${property.city}, ${property.state || ''}`.trim();
  const description = `${property.deal_type}${property.asking_price ? ` - $${property.asking_price}` : ''}`;
  const imageUrl = property.front_photo || property.photo_link || '';
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  
  <!-- Open Graph meta tags for link previews -->
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${description}" />
  <meta property="og:image" content="${imageUrl}" />
  <meta property="og:url" content="${fullUrl}" />
  <meta property="og:type" content="website" />
  
  <!-- Twitter Card meta tags -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${title}" />
  <meta name="twitter:description" content="${description}" />
  <meta name="twitter:image" content="${imageUrl}" />
  
  <!-- Redirect to React app after a brief delay -->
  <meta http-equiv="refresh" content="0;url=https://xqlmeprrvijmcxvbaubq.lovableproject.com/property?address=${property.address_slug}" />
</head>
<body>
  <p>Redirecting to property page...</p>
  <script>
    window.location.href = 'https://xqlmeprrvijmcxvbaubq.lovableproject.com/property?address=${property.address_slug}';
  </script>
</body>
</html>`;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const addressSlug = url.searchParams.get('address');

    if (!addressSlug) {
      return new Response(
        JSON.stringify({ error: 'Missing address parameter' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log(`Fetching property with slug: ${addressSlug}`);

    // Fetch property data using the public function
    const { data: properties, error } = await supabase
      .rpc('get_public_property_data', { property_address: addressSlug });

    if (error) {
      console.error('Error fetching property:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch property data' }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    if (!properties || properties.length === 0) {
      console.log('Property not found');
      return new Response(
        JSON.stringify({ error: 'Property not found' }),
        { 
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const property = properties[0];
    const userAgent = req.headers.get('user-agent');
    const fullUrl = `${SUPABASE_URL}/functions/v1/property-meta-preview?address=${addressSlug}`;

    console.log(`User-Agent: ${userAgent}, Is Crawler: ${isCrawler(userAgent)}`);

    // If it's a crawler, return HTML with OG meta tags
    if (isCrawler(userAgent)) {
      console.log('Serving meta tags to crawler');
      const html = generateMetaHtml(property, fullUrl);
      return new Response(html, {
        headers: {
          ...corsHeaders,
          'Content-Type': 'text/html',
          'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
        },
      });
    }

    // For regular browsers, redirect to the React app
    console.log('Redirecting browser to React app');
    return Response.redirect(
      `https://xqlmeprrvijmcxvbaubq.lovableproject.com/property?address=${addressSlug}`,
      302
    );

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
