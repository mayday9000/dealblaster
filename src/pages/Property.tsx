import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Download, ArrowLeft, Printer } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { generatePDF, PDFData } from '@/utils/pdfGenerator';

const Property = () => {
  const [searchParams] = useSearchParams();
  const [htmlContent, setHtmlContent] = useState<string>('');
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

        if (!property.html_content) {
          throw new Error('Property HTML content not found');
        }

        setHtmlContent(property.html_content);
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

  const handleDownloadPDF = async () => {
    if (!propertyData) {
      toast({
        title: "Error",
        description: "Property data not loaded yet.",
        variant: "destructive"
      });
      return;
    }

    try {
      console.log('Full property data for PDF:', propertyData);
      
      // Map property data to PDF format - using actual field names from database
      const pdfData: PDFData = {
        title: propertyData.title || propertyData.deal_type || 'Property Investment Opportunity',
        subtitle: propertyData.subtitle || 'Real Estate Investment',
        city: propertyData.city || '',
        dealType: propertyData.deal_type || 'Investment',
        hook: propertyData.hook || '',
        selectedTitle: propertyData.selected_title || propertyData.title || propertyData.deal_type || 'Investment Property',
        address: propertyData.address || '',
        askingPrice: propertyData.asking_price || propertyData.price || 'TBD',
        financingTypes: Array.isArray(propertyData.financing_types) ? propertyData.financing_types : ['TBD'],
        closingDate: propertyData.closing_date || 'TBD',
        photoLink: propertyData.photo_link || '',
        frontPhoto: null,
        bedrooms: propertyData.bedrooms?.toString() || 'TBD',
        bathrooms: propertyData.bathrooms?.toString() || 'TBD',
        squareFootage: propertyData.square_footage?.toString() || 'TBD',
        yearBuilt: propertyData.year_built?.toString() || 'TBD',
        zoning: propertyData.zoning || '',
        lotSize: propertyData.lot_size || '',
        foundationType: propertyData.foundation_type || '',
        utilities: Array.isArray(propertyData.utilities) ? propertyData.utilities : [],
        garage: propertyData.garage || '',
        pool: propertyData.pool || false,
        roofAge: propertyData.roof_age || '',
        roofSpecificAge: propertyData.roof_specific_age || '',
        roofLastServiced: propertyData.roof_last_serviced || '',
        roofCondition: propertyData.roof_condition || '',
        hvacAge: propertyData.hvac_age || '',
        hvacSpecificAge: propertyData.hvac_specific_age || '',
        hvacLastServiced: propertyData.hvac_last_serviced || '',
        hvacCondition: propertyData.hvac_condition || '',
        waterHeaterAge: propertyData.water_heater_age || '',
        waterHeaterSpecificAge: propertyData.water_heater_specific_age || '',
        waterHeaterLastServiced: propertyData.water_heater_last_serviced || '',
        waterHeaterCondition: propertyData.water_heater_condition || '',
        currentOccupancy: propertyData.current_occupancy || '',
        closingOccupancy: propertyData.closing_occupancy || '',
        includeFinancialBreakdown: propertyData.include_financial_breakdown || false,
        arv: propertyData.arv || '',
        rehabEstimate: propertyData.rehab_estimate || '',
        allIn: propertyData.all_in || '',
        grossProfit: propertyData.gross_profit || '',
        exitStrategy: propertyData.exit_strategy || '',
        comps: Array.isArray(propertyData.comps) ? propertyData.comps : [],
        contactName: propertyData.contact_name || 'Contact Us',
        contactPhone: propertyData.contact_phone || 'TBD',
        contactEmail: propertyData.contact_email || '',
        officeNumber: propertyData.office_number || '',
        businessHours: propertyData.business_hours || '',
        contactImage: propertyData.contact_image || null,
        website: propertyData.website || '',
        memoFiled: propertyData.memo_filed || false,
        emdAmount: propertyData.emd_amount || '',
        emdDueDate: propertyData.emd_due_date || '',
        postPossession: propertyData.post_possession || false,
        additionalDisclosures: propertyData.additional_disclosures || '',
      };
      
      console.log('Mapped PDF data:', pdfData);
      
      await generatePDF(pdfData);
      
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