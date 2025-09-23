import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Download, ArrowLeft, Printer } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';


const Property = () => {
  const [searchParams] = useSearchParams();
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [extractedContent, setExtractedContent] = useState<string>('');
  const [propertyData, setPropertyData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  
  const addressSlug = searchParams.get('address');

  useEffect(() => {
    const fetchProperty = async () => {
      if (!addressSlug) {
        setError('No property address provided');
        setLoading(false);
        return;
      }

      try {
        // Get public property data using secure function
        const { data: property, error: supabaseError } = await supabase
          .rpc('get_public_property_data', { 
            property_address: addressSlug 
          })
          .maybeSingle();

        if (supabaseError) {
          console.error('Supabase error:', supabaseError);
          throw new Error('Database error occurred');
        }

        console.log('Property query result:', property);

        if (!property) {
          throw new Error('Property not found in database');
        }

        if (!property.html_content) {
          throw new Error('Property HTML content not found');
        }

        setHtmlContent(property.html_content);
        
        // Extract content from iframe srcdoc for consistent viewing and printing
        const parser = new DOMParser();
        const doc = parser.parseFromString(property.html_content, 'text/html');
        const iframe = doc.querySelector('iframe');
        if (iframe && iframe.getAttribute('srcdoc')) {
          setExtractedContent(iframe.getAttribute('srcdoc') || '');
        } else {
          // If no iframe, use the content directly
          setExtractedContent(property.html_content);
        }
        
        setPropertyData(property);
      } catch (err) {
        console.error('Error fetching property:', err);
        setError(err instanceof Error ? err.message : 'Property listing not found');
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [addressSlug]);

  const handleDownloadPDF = () => {
    if (!htmlContent) {
      toast({
        title: "Error",
        description: "Property content not loaded yet.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Use the browser's print functionality to save as PDF
      window.print();
      
      toast({
        title: "Print Dialog Opened",
        description: "Use your browser's print dialog to save as PDF.",
      });
    } catch (error) {
      console.error('Print failed:', error);
      toast({
        title: "Print Error",
        description: "Unable to open print dialog. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading property...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="text-center p-6">
            <h1 className="text-xl font-semibold mb-2">Listing Not Found</h1>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button asChild>
              <Link to="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header with controls - always visible, fixed at top */}
      <div className="fixed top-0 left-0 right-0 bg-card border-b print:hidden z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="outline" asChild>
              <Link to="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Generator
              </Link>
            </Button>
            
            <Button onClick={handleDownloadPDF} className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Download as PDF
            </Button>
          </div>
        </div>
      </div>

      {/* Property content with top padding to account for fixed header */}
      <div className="property-content pt-20">
        {/* Use extracted content for both screen and print for consistency */}
        <div className="flyer-container mx-auto max-w-4xl px-4 text-left">
          <div 
            className="flyer-content"
            dangerouslySetInnerHTML={{ __html: extractedContent }}
          />
        </div>
      </div>
      
      {/* Print styles */}
      <style>{`
        /* Screen styles - center the flyer content */
        .flyer-container {
          display: flex;
          justify-content: center;
        }
        
        .flyer-content {
          width: 100%;
          max-width: 900px;
        }
        
        /* Override problematic inline styles in the flyer content */
        .flyer-content * {
          height: auto !important;
          overflow: visible !important;
        }
        
        .flyer-content [style*="height: 100vh"] {
          height: auto !important;
        }
        
        .flyer-content [style*="overflow: auto"],
        .flyer-content [style*="overflow: scroll"] {
          overflow: visible !important;
        }
        
        .flyer-content [style*="position: fixed"] {
          position: relative !important;
        }
        
        @media print {
          .print\\:hidden {
            display: none !important;
          }
          
          .property-content {
            margin: 0;
            padding: 0 !important;
            max-width: none !important;
            width: 100% !important;
            height: auto !important;
            overflow: visible !important;
          }
          
          .flyer-container {
            max-width: none !important;
            margin: 0 auto !important;
            padding: 0 !important;
            display: block !important;
          }
          
          .flyer-content {
            width: 100% !important;
            max-width: none !important;
            height: auto !important;
            overflow: visible !important;
            page-break-inside: auto;
          }
          
          .flyer-content * {
            max-width: none !important;
            overflow: visible !important;
            page-break-inside: auto;
            height: auto !important;
          }
          
          body {
            margin: 0;
            padding: 0;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          
          @page {
            margin: 0.5in;
            size: A4;
          }
          
          /* Force content to break across pages naturally */
          .flyer-content > * {
            page-break-inside: auto;
          }
          
          /* Avoid breaking certain elements */
          h1, h2, h3, h4, h5, h6 {
            page-break-after: avoid;
            page-break-inside: avoid;
          }
          
          img {
            page-break-inside: avoid;
            max-width: 100% !important;
            height: auto !important;
          }
          
          table {
            page-break-inside: auto;
          }
          
          tr {
            page-break-inside: avoid;
          }
          
          /* Override any problematic inline styles for print */
          .flyer-content [style*="height: 100vh"] {
            height: auto !important;
          }
          
          .flyer-content [style*="overflow: auto"],
          .flyer-content [style*="overflow: scroll"] {
            overflow: visible !important;
          }
          
          .flyer-content [style*="position: fixed"] {
            position: relative !important;
          }
        }
        
        /* Ensure the header stays above any generated content */
        .property-content * {
          position: relative;
          z-index: auto;
        }
      `}</style>
    </div>
  );
};

export default Property;