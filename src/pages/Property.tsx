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
        // First, get property data from Supabase
        const { data: propertyData, error: supabaseError } = await supabase
          .from('properties')
          .select('*')
          .eq('address_slug', addressSlug)
          .single();

        if (supabaseError || !propertyData) {
          throw new Error('Property not found in database');
        }

        // Convert Supabase data back to webhook format
        const webhookData = {
          city: propertyData.city,
          dealType: propertyData.deal_type,
          hook: propertyData.hook,
          generatedTitles: propertyData.generated_titles,
          selectedTitle: propertyData.selected_title,
          address: propertyData.address,
          askingPrice: propertyData.asking_price,
          financingTypes: propertyData.financing_types,
          closingDate: propertyData.closing_date,
          photoLink: propertyData.photo_link,
          frontPhoto: propertyData.front_photo,
          bedrooms: propertyData.bedrooms,
          bathrooms: propertyData.bathrooms,
          squareFootage: propertyData.square_footage,
          yearBuilt: propertyData.year_built,
          zoning: propertyData.zoning,
          lotSize: propertyData.lot_size,
          foundationType: propertyData.foundation_type,
          utilities: propertyData.utilities,
          garage: propertyData.garage,
          pool: propertyData.pool,
          roofAge: propertyData.roof_age,
          roofSpecificAge: propertyData.roof_specific_age,
          roofLastServiced: propertyData.roof_last_serviced,
          roofCondition: propertyData.roof_condition,
          hvacAge: propertyData.hvac_age,
          hvacSpecificAge: propertyData.hvac_specific_age,
          hvacLastServiced: propertyData.hvac_last_serviced,
          hvacCondition: propertyData.hvac_condition,
          waterHeaterAge: propertyData.water_heater_age,
          waterHeaterSpecificAge: propertyData.water_heater_specific_age,
          waterHeaterLastServiced: propertyData.water_heater_last_serviced,
          waterHeaterCondition: propertyData.water_heater_condition,
          currentOccupancy: propertyData.current_occupancy,
          closingOccupancy: propertyData.closing_occupancy,
          includeFinancialBreakdown: propertyData.include_financial_breakdown,
          arv: propertyData.arv,
          rehabEstimate: propertyData.rehab_estimate,
          allIn: propertyData.all_in,
          grossProfit: propertyData.gross_profit,
          exitStrategy: propertyData.exit_strategy,
          comps: propertyData.comps,
          contactName: propertyData.contact_name,
          contactPhone: propertyData.contact_phone,
          contactEmail: propertyData.contact_email,
          officeNumber: propertyData.office_number,
          businessHours: propertyData.business_hours,
          contactImage: propertyData.contact_image,
          website: propertyData.website,
          memoFiled: propertyData.memo_filed,
          emdAmount: propertyData.emd_amount,
          emdDueDate: propertyData.emd_due_date,
          postPossession: propertyData.post_possession,
          additionalDisclosures: propertyData.additional_disclosures,
          title: propertyData.selected_title || `${propertyData.city} ${propertyData.deal_type} Opportunity`,
          subtitle: `${propertyData.deal_type} Investment Property - ${propertyData.address}`
        };

        // Generate HTML using the webhook
        const response = await fetch('https://mayday.app.n8n.cloud/webhook-test/dealblaster', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(webhookData),
        });
        
        if (!response.ok) {
          throw new Error(`Failed to generate HTML: ${response.status}`);
        }

        const html = await response.text();
        setHtmlContent(html);
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
    try {
      // For now, just use the print functionality
      // The PDF endpoint would need to be implemented on the backend
      window.print();
    } catch (error) {
      console.error('Print failed:', error);
      toast({
        title: "Print Error",
        description: "Unable to print the document.",
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