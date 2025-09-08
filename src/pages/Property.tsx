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
          .single();

        if (supabaseError || !property) {
          throw new Error('Property not found in database');
        }

        if (!property.html_content) {
          throw new Error('Property HTML not generated yet');
        }

        setHtmlContent(property.html_content);
        setPropertyData(property);
      } catch (err) {
        console.error('Error fetching property:', err);
        setError('Property listing not found');
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
      // Transform property data to match PDF generator format
      const pdfData = {
        title: propertyData.title || `${propertyData.city} ${propertyData.deal_type} Opportunity`,
        subtitle: propertyData.subtitle || `${propertyData.deal_type} Investment Property - ${propertyData.address}`,
        city: propertyData.city || '',
        dealType: propertyData.deal_type || '',
        hook: propertyData.hook || '',
        selectedTitle: propertyData.selected_title || propertyData.title || '',
        address: propertyData.address || '',
        askingPrice: propertyData.asking_price || '',
        financingTypes: propertyData.financing_types || [],
        closingDate: propertyData.closing_date || '',
        photoLink: propertyData.photo_link || '',
        frontPhoto: null,
        bedrooms: propertyData.bedrooms || '',
        bathrooms: propertyData.bathrooms || '',
        squareFootage: propertyData.square_footage || '',
        yearBuilt: propertyData.year_built || '',
        zoning: propertyData.zoning || '',
        lotSize: propertyData.lot_size || '',
        foundationType: propertyData.foundation_type || '',
        utilities: propertyData.utilities || [],
        garage: propertyData.garage_display || '',
        pool: propertyData.pool || false,
        roofAge: '',
        roofSpecificAge: '',
        roofLastServiced: '',
        roofCondition: '',
        hvacAge: '',
        hvacSpecificAge: '',
        hvacLastServiced: '',
        hvacCondition: '',
        waterHeaterAge: '',
        waterHeaterSpecificAge: '',
        waterHeaterLastServiced: '',
        waterHeaterCondition: '',
        currentOccupancy: propertyData.occupancy || '',
        closingOccupancy: propertyData.occupancy_on_delivery || '',
        includeFinancialBreakdown: propertyData.include_financial_breakdown || false,
        arv: propertyData.arv || '',
        rehabEstimate: propertyData.rehab_estimate || '',
        allIn: propertyData.all_in || '',
        grossProfit: propertyData.gross_profit || '',
        exitStrategy: propertyData.exit_strategy || '',
        comps: propertyData.comps || [],
        contactName: propertyData.contact_name || '',
        contactPhone: propertyData.contact_phone || '',
        contactEmail: propertyData.contact_email || '',
        officeNumber: propertyData.office_number || '',
        businessHours: propertyData.business_hours_display || '',
        contactImage: null,
        website: propertyData.website || '',
        memoFiled: false,
        emdAmount: propertyData.emd_amount || '',
        emdDueDate: propertyData.emd_due_date || '',
        postPossession: propertyData.post_possession || false,
        additionalDisclosures: propertyData.additional_disclosures || '',
      };

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
      {/* Header with controls - hidden on print */}
      <div className="bg-card border-b print:hidden">
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

      {/* Property content */}
      <div 
        className="property-content"
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
            padding: 0;
          }
          
          body {
            margin: 0;
            padding: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default Property;