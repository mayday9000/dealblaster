import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import SuccessModal from "@/components/SuccessModal";
import { slugify } from "@/utils/slugify";

interface FormData {
  // Listing Headline
  city: string;
  state: string;
  zip: string;
  dealType: string;
  hook: string;
  generatedTitles: string[];
  selectedTitle: string;
  isPremarket: boolean;
  
  // Basic Info
  address: string;
  askingPrice: string;
  financingTypes: string[];
  financingOther: string;
  closingDate: string;
  closingDateType: string;
  
  // Photo Section
  photoLink: string;
  frontPhoto: File | null;
  
  // Property Overview
  bedrooms: string;
  bathrooms: string;
  squareFootage: string;
  yearBuilt: string;
  zoning: string;
  lotSize: string;
  foundationType: string;
  utilities: string[];
  utilitiesOther: string;
  garageSpaces: string;
  garageType: string;
  pool: boolean;
  
  // Big Ticket Systems
  bigTicketItems: any[];
  
  // Occupancy
  occupancy: string;
  occupancyOnDelivery: string;
  
  // Financial Snapshot
  includeFinancialBreakdown: boolean;
  arv: string;
  rehabEstimate: string;
  allIn: string;
  grossProfit: string;
  exitStrategy: string;
  
  // Comps
  comps: any[];
  
  // Contact Information
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  officeNumber: string;
  businessHours: string;
  contactImage: File | null;
  website: string;
  
  // Legal Disclosures
  emdAmount: string;
  emdDueDate: string;
  postPossession: string;
  additionalDisclosures: string;
}

const TestPreset = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    // Listing Headline - PRESET DATA
    city: 'Charlotte',
    state: 'NC',
    zip: '28202',
    dealType: 'Investment Property',
    hook: 'Great cash flow opportunity in prime location!',
    generatedTitles: [
      'Turn-Key Investment Property in Charlotte',
      'Prime Charlotte Investment - Ready to Rent',
      'Solid Cash Flow Property in Charlotte'
    ],
    selectedTitle: 'Turn-Key Investment Property in Charlotte',
    isPremarket: false,
    
    // Basic Info - PRESET DATA
    address: '123 Main Street',
    askingPrice: '285000',
    financingTypes: ['Cash', 'Conventional Loan'],
    financingOther: '',
    closingDate: '2024-12-15',
    closingDateType: 'exact',
    
    // Photo Section - PRESET DATA
    photoLink: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994',
    frontPhoto: null,
    
    // Property Overview - PRESET DATA
    bedrooms: '3',
    bathrooms: '2',
    squareFootage: '1450',
    yearBuilt: '1985',
    zoning: 'R-4',
    lotSize: '0.25',
    foundationType: 'Slab',
    utilities: ['Electricity', 'Water', 'Sewer', 'Natural Gas'],
    utilitiesOther: '',
    garageSpaces: '2',
    garageType: 'Attached',
    pool: false,
    
    // Big Ticket Systems - PRESET DATA
    bigTicketItems: [
      { type: 'Roof', age: '5-10', ageType: 'range', specificYear: '', condition: 'Good', lastServiced: '2022' },
      { type: 'HVAC', age: '3-5', ageType: 'range', specificYear: '', condition: 'Excellent', lastServiced: '2023' },
      { type: 'Water Heater', age: '1-3', ageType: 'range', specificYear: '', condition: 'Excellent', lastServiced: '2024' }
    ],
    
    // Occupancy - PRESET DATA
    occupancy: 'Vacant',
    occupancyOnDelivery: 'Vacant',
    
    // Financial Snapshot - PRESET DATA
    includeFinancialBreakdown: true,
    arv: '320000',
    rehabEstimate: '15000',
    allIn: '300000',
    grossProfit: '20000',
    exitStrategy: 'Rental Property',
    
    // Comps - PRESET DATA
    comps: [
      {
        address: '456 Oak Ave',
        zillowLink: 'https://zillow.com/example1',
        bedrooms: '3',
        bathrooms: '2',
        squareFootage: '1420',
        lotSize: '0.23',
        compType: 'Active Listing',
        conditionLabel: 'Move-in Ready',
        assetType: 'Single Family',
        assetTypeOther: '',
        status: 'Active',
        soldListedPrice: '295000',
        soldListedPriceType: 'Listed',
        soldListedDate: '2024-10-01',
        currentlyListed: 'Yes',
        dom: '15',
        distanceFromSubject: '0.3',
        comments: 'Similar layout and condition'
      },
      {
        address: '789 Pine St',
        zillowLink: 'https://zillow.com/example2',
        bedrooms: '3',
        bathrooms: '2',
        squareFootage: '1380',
        lotSize: '0.20',
        compType: 'Sold',
        conditionLabel: 'Good Condition',
        assetType: 'Single Family',
        assetTypeOther: '',
        status: 'Sold',
        soldListedPrice: '275000',
        soldListedPriceType: 'Sold',
        soldListedDate: '2024-09-15',
        currentlyListed: 'No',
        dom: '8',
        distanceFromSubject: '0.5',
        comments: 'Slightly smaller but similar neighborhood'
      }
    ],
    
    // Contact Information - PRESET DATA
    contactName: 'John Smith',
    contactPhone: '(555) 123-4567',
    contactEmail: 'john.smith@realestate.com',
    officeNumber: '(555) 987-6543',
    businessHours: 'Mon-Fri 9AM-6PM, Sat 10AM-4PM',
    contactImage: null,
    website: 'www.johnsmithrealty.com',
    
    // Legal Disclosures - PRESET DATA
    emdAmount: '5000',
    emdDueDate: '2024-11-01',
    postPossession: 'Available at closing',
    additionalDisclosures: 'Property sold as-is. Buyer to verify all information.'
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [shareUrl, setShareUrl] = useState('');

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const validateRequiredFields = () => {
    const requiredFields = [
      { field: formData.address, name: 'Address' },
      { field: formData.city, name: 'City' },
      { field: formData.dealType, name: 'Deal Type' }
    ];

    for (const { field, name } of requiredFields) {
      if (!field.trim()) {
        toast({
          title: "Missing Required Field",
          description: `${name} is required to generate the flyer.`,
          variant: "destructive",
        });
        return false;
      }
    }
    return true;
  };

  const handleGeneratePDF = async () => {
    if (!validateRequiredFields()) return;

    setIsGenerating(true);
    
    try {
      let frontPhotoBase64 = '';
      let contactImageBase64 = '';

      if (formData.frontPhoto) {
        frontPhotoBase64 = await convertFileToBase64(formData.frontPhoto);
      }

      if (formData.contactImage) {
        contactImageBase64 = await convertFileToBase64(formData.contactImage);
      }

      const webhookData = {
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zip: formData.zip,
        dealType: formData.dealType,
        hook: formData.hook,
        selectedTitle: formData.selectedTitle || formData.generatedTitles[0],
        isPremarket: formData.isPremarket,
        askingPrice: formData.askingPrice,
        financingTypes: formData.financingTypes,
        financingOther: formData.financingOther,
        closingDate: formData.closingDate,
        closingDateType: formData.closingDateType,
        photoLink: formData.photoLink,
        frontPhoto: frontPhotoBase64,
        bedrooms: formData.bedrooms,
        bathrooms: formData.bathrooms,
        squareFootage: formData.squareFootage,
        yearBuilt: formData.yearBuilt,
        zoning: formData.zoning,
        lotSize: formData.lotSize,
        foundationType: formData.foundationType,
        utilities: formData.utilities,
        utilitiesOther: formData.utilitiesOther,
        garageSpaces: formData.garageSpaces,
        garageType: formData.garageType,
        pool: formData.pool,
        bigTicketItems: formData.bigTicketItems,
        occupancy: formData.occupancy,
        occupancyOnDelivery: formData.occupancyOnDelivery,
        includeFinancialBreakdown: formData.includeFinancialBreakdown,
        arv: formData.arv,
        rehabEstimate: formData.rehabEstimate,
        allIn: formData.allIn,
        grossProfit: formData.grossProfit,
        exitStrategy: formData.exitStrategy,
        comps: formData.comps,
        contactName: formData.contactName,
        contactPhone: formData.contactPhone,
        contactEmail: formData.contactEmail,
        officeNumber: formData.officeNumber,
        businessHours: formData.businessHours,
        contactImage: contactImageBase64,
        website: formData.website,
        emdAmount: formData.emdAmount,
        emdDueDate: formData.emdDueDate,
        postPossession: formData.postPossession,
        additionalDisclosures: formData.additionalDisclosures
      };

      const response = await fetch('https://hook.us2.make.com/4ca8fudqhsoa5bvjjngek6fy6q0hv8m4', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookData),
      });

      if (!response.ok) {
        throw new Error('Failed to generate flyer');
      }

      const htmlResult = await response.text();
      console.log('HTML result received from webhook');

      const addressSlug = slugify(`${formData.address} ${formData.city}`);
      const propertyRecord = {
        address: formData.address,
        city: formData.city,
        deal_type: formData.dealType,
        address_slug: addressSlug,
        html_content: htmlResult,
      };

      const { data: insertResult, error: supabaseError } = await (supabase as any)
        .rpc('secure_upsert_property', { 
          property_data: propertyRecord
        });

      if (supabaseError) {
        console.error('Supabase error:', supabaseError);
        throw new Error('Failed to save generated HTML');
      }

      console.log('Property saved successfully:', insertResult);

      const propertyUrl = `/property?address=${encodeURIComponent(formData.address)}`;
      setShareUrl(propertyUrl);
      setShowSuccessModal(true);

      toast({
        title: "Success!",
        description: "Your property flyer has been generated successfully.",
      });

    } catch (error) {
      console.error('Error generating flyer:', error);
      toast({
        title: "Error",
        description: "Failed to generate property flyer. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Main Form
          </Button>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Test Preset - Property Flyer Generator
            </h1>
            <p className="text-muted-foreground mt-2">
              Form pre-filled with sample data for easy testing
            </p>
          </div>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Sample Property Data</CardTitle>
            <CardDescription>
              This form is pre-filled with realistic sample data. You can modify any fields or click "Generate Property Flyer" to test with the current data.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="askingPrice">Asking Price</Label>
                <Input
                  id="askingPrice"
                  value={formData.askingPrice}
                  onChange={(e) => setFormData(prev => ({ ...prev, askingPrice: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="bedrooms">Bedrooms</Label>
                <Input
                  id="bedrooms"
                  value={formData.bedrooms}
                  onChange={(e) => setFormData(prev => ({ ...prev, bedrooms: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="bathrooms">Bathrooms</Label>
                <Input
                  id="bathrooms"
                  value={formData.bathrooms}
                  onChange={(e) => setFormData(prev => ({ ...prev, bathrooms: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="squareFootage">Square Footage</Label>
                <Input
                  id="squareFootage"
                  value={formData.squareFootage}
                  onChange={(e) => setFormData(prev => ({ ...prev, squareFootage: e.target.value }))}
                />
              </div>
            </div>

            <div className="pt-4">
              <h3 className="text-lg font-semibold mb-2">Pre-filled Data Includes:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                <ul className="space-y-1">
                  <li>• Property details (3BR/2BA, 1450 sq ft)</li>
                  <li>• Financial data (ARV: $320k, Rehab: $15k)</li>
                  <li>• Contact information</li>
                  <li>• Big ticket systems condition</li>
                </ul>
                <ul className="space-y-1">
                  <li>• Two sample comparable properties</li>
                  <li>• Property photos and utilities</li>
                  <li>• Legal disclosures</li>
                  <li>• Marketing hook and titles</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Generate Button */}
        <div className="flex justify-center mb-8">
          <Button 
            onClick={handleGeneratePDF} 
            disabled={isGenerating}
            size="lg"
            className="px-8 py-6 text-lg font-semibold"
          >
            {isGenerating ? 'Generating...' : 'Generate Property Flyer'}
          </Button>
        </div>

        <SuccessModal
          open={showSuccessModal}
          onOpenChange={setShowSuccessModal}
          shareUrl={shareUrl}
          onCopyUrl={() => {
            navigator.clipboard.writeText(`${window.location.origin}${shareUrl}`);
            toast({ title: "Link copied to clipboard!" });
          }}
          onViewProperty={() => {
            window.open(shareUrl, '_blank');
          }}
        />
      </div>
    </div>
  );
};

export default TestPreset;