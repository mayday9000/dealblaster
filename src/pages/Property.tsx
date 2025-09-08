import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Download, ArrowLeft, Printer } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { generatePDF } from '@/utils/pdfGenerator';

const Property = () => {
  const [searchParams] = useSearchParams();
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [propertyData, setPropertyData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  
  const addressSlug = searchParams.get('address');

  console.log('Property page loaded with addressSlug:', addressSlug);

  useEffect(() => {
    const fetchProperty = async () => {
      if (!addressSlug) {
        setError('No property address provided');
        setLoading(false);
        return;
      }

      try {
        // Get all property data from Supabase
        const { data: property, error: supabaseError } = await supabase
          .from('properties')
          .select('*')
          .eq('address_slug', addressSlug)
          .maybeSingle();

        if (supabaseError) {
          console.error('Supabase error:', supabaseError);
          throw new Error('Database error occurred');
        }

        console.log('Property query result:', property);

        if (!property) {
          throw new Error('Property not found in database');
        }

        // Set property data regardless of HTML content status
        setPropertyData(property);

        // If HTML content is not yet generated, we'll show a generating state
        if (!property.html_content) {
          setHtmlContent(null);
          console.log('Property found but HTML content still generating...');
        } else {
          setHtmlContent(property.html_content);
        }
      } catch (err) {
        console.error('Error fetching property:', err);
        setError(err instanceof Error ? err.message : 'Property listing not found');
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [addressSlug]);

  const handleDownloadPDF = async () => {
    if (!htmlContent) {
      toast({
        title: "Error",
        description: "Property content not loaded yet.",
        variant: "destructive"
      });
      return;
    }

    try {
      const { default: html2canvas } = await import('html2canvas');
      const { jsPDF } = await import('jspdf');
      
      // Get the property content element
      const element = document.querySelector('.property-content') as HTMLElement;
      if (!element) {
        throw new Error('Property content not found');
      }

      // Create canvas from the HTML content
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        scrollX: 0,
        scrollY: 0,
      });

      // Create PDF
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      // Add first page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add additional pages if needed
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Download the PDF
      const fileName = propertyData?.address 
        ? `${propertyData.address.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_listing.pdf`
        : 'property_listing.pdf';
      
      pdf.save(fileName);
      
      toast({
        title: "Success",
        description: "PDF downloaded successfully!",
      });
    } catch (error) {
      console.error('PDF generation failed:', error);
      toast({
        title: "PDF Error",
        description: "Unable to generate PDF. Please try again.",
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

  // Show generating state if HTML content is not ready yet
  if (!htmlContent && propertyData) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header with controls */}
        <div className="fixed top-0 left-0 right-0 bg-card border-b print:hidden z-50 shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Button variant="outline" asChild>
                <Link to="/">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Generator
                </Link>
              </Button>
              
              <Button disabled className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                Download as PDF
              </Button>
            </div>
          </div>
        </div>

        {/* Generating state */}
        <div className="pt-20 flex items-center justify-center min-h-[calc(100vh-5rem)]">
          <Card className="max-w-md">
            <CardContent className="text-center p-6">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <h1 className="text-xl font-semibold mb-2">Generating Your Flyer</h1>
              <p className="text-muted-foreground mb-4">
                Your property listing is being generated. This usually takes 30-60 seconds.
              </p>
              <p className="text-sm text-muted-foreground">
                Found property: {propertyData.address || 'Unknown Address'}
              </p>
            </CardContent>
          </Card>
        </div>
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
      <div 
        className="property-content pt-20"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
      
      {/* Print styles */}
      <style>{`
        @media print {
          .print\\:hidden {
            display: none !important;
          }
          
          .property-content {
            margin: 0;
            padding: 0 !important;
          }
          
          body {
            margin: 0;
            padding: 0;
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