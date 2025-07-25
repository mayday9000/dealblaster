import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/hooks/use-toast';
import { generatePDF } from '@/utils/pdfGenerator';
import { Sparkles } from 'lucide-react';

interface FormData {
  // Listing Headline
  city: string;
  dealType: string;
  hook: string;
  generatedTitles: string[];
  selectedTitle: string;
  
  // Basic Info
  address: string;
  askingPrice: string;
  financingTypes: string[];
  closingDate: string;
  
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
  garage: string;
  pool: boolean;
  
  // Big Ticket Systems
  roofAge: string;
  roofSpecificAge: string;
  roofLastServiced: string;
  roofCondition: string;
  hvacAge: string;
  hvacSpecificAge: string;
  hvacLastServiced: string;
  hvacCondition: string;
  waterHeaterAge: string;
  waterHeaterSpecificAge: string;
  waterHeaterLastServiced: string;
  waterHeaterCondition: string;
  
  // Occupancy
  currentOccupancy: string;
  closingOccupancy: string;
  
  // Financial Snapshot
  includeFinancialBreakdown: boolean;
  arv: string;
  rehabEstimate: string;
  allIn: string;
  grossProfit: string;
  exitStrategy: string;
  
  // Comps
  comps: Array<{
    address: string;
    zillowLink: string;
    bedrooms: string;
    bathrooms: string;
    squareFootage: string;
    compType: string;
    conditionLabel: string;
    assetType: string;
  }>;
  
  // Contact Info
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  officeNumber: string;
  businessHours: string;
  contactImage: File | null;
  website: string;
  
  // Legal Disclosures
  memoFiled: boolean;
  emdAmount: string;
  emdDueDate: string;
  postPossession: boolean;
  additionalDisclosures: string;
}

const Index = () => {
  const [formData, setFormData] = useState<FormData>({
    // Listing Headline
    city: '',
    dealType: '',
    hook: '',
    generatedTitles: [],
    selectedTitle: '',
    
    // Basic Info
    address: '',
    askingPrice: '',
    financingTypes: ['Cash'], // Default to Cash for simplified form
    closingDate: '',
    
    // Photo Section
    photoLink: '',
    frontPhoto: null,
    
    // Property Overview
    bedrooms: '',
    bathrooms: '',
    squareFootage: '',
    yearBuilt: '2000', // Default values for simplified form
    zoning: 'Residential',
    lotSize: '',
    foundationType: 'Slab',
    utilities: ['City Water', 'Sewer'],
    garage: '',
    pool: false,
    
    // Big Ticket Systems - Default values for simplified form
    roofAge: '10-15',
    roofSpecificAge: '',
    roofLastServiced: '',
    roofCondition: 'Good',
    hvacAge: '10-15',
    hvacSpecificAge: '',
    hvacLastServiced: '',
    hvacCondition: 'Good',
    waterHeaterAge: '5-10',
    waterHeaterSpecificAge: '',
    waterHeaterLastServiced: '',
    waterHeaterCondition: 'Good',
    
    // Occupancy
    currentOccupancy: 'Vacant',
    closingOccupancy: 'Vacant',
    
    // Financial Snapshot
    includeFinancialBreakdown: false,
    arv: '',
    rehabEstimate: '',
    allIn: '',
    grossProfit: '',
    exitStrategy: '',
    
    // Comps
    comps: [
      {
        address: '',
        zillowLink: '',
        bedrooms: '',
        bathrooms: '',
        squareFootage: '',
        compType: 'Flip Comp',
        conditionLabel: '',
        assetType: 'Residential',
      },
      {
        address: '',
        zillowLink: '',
        bedrooms: '',
        bathrooms: '',
        squareFootage: '',
        compType: 'Cash Comp',
        conditionLabel: '',
        assetType: 'Residential',
      }
    ],
    
    // Contact Info
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    officeNumber: '',
    businessHours: '',
    contactImage: null,
    website: '',
    
    // Legal Disclosures
    memoFiled: false,
    emdAmount: '',
    emdDueDate: '',
    postPossession: false,
    additionalDisclosures: '',
  });

  const [isGenerating, setIsGenerating] = useState(false);

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateComp = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      comps: prev.comps.map((comp, i) => 
        i === index ? { ...comp, [field]: value } : comp
      )
    }));
  };

  const generateTitles = () => {
    const city = formData.city || 'Prime Location';
    const dealType = formData.dealType || 'Investment';
    const hook = formData.hook || 'Great Opportunity';
    
    const titles = [
      `${city}, NC - ${hook} ${dealType} Deal!`,
      `${dealType} Opportunity in ${city} - ${hook}`,
      `${city} ${dealType} - ${hook} Investment Property`
    ];
    
    updateFormData('generatedTitles', titles);
    updateFormData('selectedTitle', titles[0]);
  };

  const validateRequiredFields = () => {
    const errors = [];
    
    if (!formData.city) errors.push('City');
    if (!formData.dealType) errors.push('Deal Type');
    if (!formData.address) errors.push('Full Address');
    if (!formData.askingPrice) errors.push('Asking Price');
    if (!formData.closingDate) errors.push('Closing Date');
    if (!formData.bedrooms) errors.push('Bedrooms');
    if (!formData.bathrooms) errors.push('Bathrooms');
    if (!formData.squareFootage) errors.push('Square Footage');
    if (!formData.contactName) errors.push('Contact Name');
    if (!formData.contactPhone) errors.push('Contact Phone');
    if (!formData.emdAmount) errors.push('EMD Amount');
    
    // Validate at least 2 comps with required fields
    const validComps = formData.comps.filter(comp => 
      comp.address && comp.bedrooms && comp.bathrooms && comp.squareFootage
    );
    if (validComps.length < 2) errors.push('At least 2 complete comps');
    
    return errors;
  };

  const handleGeneratePDF = async () => {
    const validationErrors = validateRequiredFields();
    
    if (validationErrors.length > 0) {
      toast({
        title: "Missing Required Fields",
        description: `Please fill in: ${validationErrors.join(', ')}`,
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      await generatePDF({
        ...formData,
        contactImage: null, // Simplified for now
        title: formData.selectedTitle || formData.generatedTitles[0] || `${formData.city} ${formData.dealType} Opportunity`,
        subtitle: `${formData.dealType} Investment Property - ${formData.address}`
      });
      
      toast({
        title: "PDF Generated Successfully!",
        description: "Your property flyer has been downloaded.",
      });
    } catch (error) {
      toast({
        title: "Error Generating PDF",
        description: "Please try again or contact support.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="relative">
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                <div className="w-8 h-6 bg-orange-600 rounded-sm"></div>
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-500 rounded-lg transform rotate-45 flex items-center justify-center">
                <div className="w-3 h-3 bg-blue-600 rounded-sm transform -rotate-45"></div>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              DEAL<span className="text-blue-600">BLASTER</span>
            </h1>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Create Listings Fast</h2>
          <p className="text-gray-600">
            The quickest way to blast out off-market deals.
          </p>
        </div>

        <Card className="shadow-sm border-0 bg-white">
          <CardContent className="p-6">
            <div className="space-y-6">
              {/* Property Details Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Property Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Input
                      placeholder="City"
                      value={formData.city}
                      onChange={(e) => updateFormData('city', e.target.value)}
                      className="bg-gray-50 border-gray-200"
                    />
                  </div>
                  <div>
                    <Select value={formData.dealType} onValueChange={(value) => updateFormData('dealType', value)}>
                      <SelectTrigger className="bg-gray-50 border-gray-200">
                        <SelectValue placeholder="Deal Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Fix & Flip">Fix & Flip</SelectItem>
                        <SelectItem value="Buy & Hold">Buy & Hold</SelectItem>
                        <SelectItem value="BRRRR">BRRRR</SelectItem>
                        <SelectItem value="Wholesale">Wholesale</SelectItem>
                        <SelectItem value="Rental">Rental</SelectItem>
                        <SelectItem value="Land">Land</SelectItem>
                        <SelectItem value="New Construction">New Construction</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Input
                      placeholder="Price"
                      value={formData.askingPrice}
                      onChange={(e) => updateFormData('askingPrice', e.target.value)}
                      className="bg-gray-50 border-gray-200"
                    />
                  </div>
                  <div>
                    <Input
                      placeholder="Close Date"
                      value={formData.closingDate}
                      onChange={(e) => updateFormData('closingDate', e.target.value)}
                      className="bg-gray-50 border-gray-200"
                    />
                  </div>
                </div>
              </div>

              {/* Property Address */}
              <div>
                <Input
                  placeholder="Full Property Address"
                  value={formData.address}
                  onChange={(e) => updateFormData('address', e.target.value)}
                  className="bg-gray-50 border-gray-200"
                />
              </div>

              {/* Key Hook */}
              <div>
                <Input
                  placeholder="Key Hook/Profit Angle (e.g. $60K spread, vacant, turnkey)"
                  value={formData.hook}
                  onChange={(e) => updateFormData('hook', e.target.value)}
                  className="bg-gray-50 border-gray-200"
                />
              </div>

              {/* Photo Link */}
              <div>
                <Input
                  placeholder="Photo Drive/Dropbox Link"
                  value={formData.photoLink}
                  onChange={(e) => updateFormData('photoLink', e.target.value)}
                  className="bg-gray-50 border-gray-200"
                />
              </div>

              {/* AI Title Generation */}
              {formData.city && formData.dealType && (
                <div>
                  <Button 
                    onClick={generateTitles} 
                    variant="outline" 
                    className="w-full mb-3"
                    disabled={!formData.city || !formData.dealType}
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate AI Titles
                  </Button>
                  
                  {formData.generatedTitles.length > 0 && (
                    <div className="space-y-2">
                      {formData.generatedTitles.map((title, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id={`title-${index}`}
                            name="selectedTitle"
                            checked={formData.selectedTitle === title}
                            onChange={() => updateFormData('selectedTitle', title)}
                          />
                          <Input
                            value={formData.selectedTitle === title ? formData.selectedTitle : title}
                            onChange={(e) => {
                              if (formData.selectedTitle === title) {
                                updateFormData('selectedTitle', e.target.value);
                              }
                            }}
                            className="flex-1 bg-gray-50 border-gray-200"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Specifications Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Specifications</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Input
                      placeholder="Beds"
                      value={formData.bedrooms}
                      onChange={(e) => updateFormData('bedrooms', e.target.value)}
                      className="bg-gray-50 border-gray-200"
                    />
                  </div>
                  <div>
                    <Input
                      placeholder="Baths"
                      value={formData.bathrooms}
                      onChange={(e) => updateFormData('bathrooms', e.target.value)}
                      className="bg-gray-50 border-gray-200"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <Input
                    placeholder="Sq Ft"
                    value={formData.squareFootage}
                    onChange={(e) => updateFormData('squareFootage', e.target.value)}
                    className="bg-gray-50 border-gray-200"
                  />
                </div>
              </div>

              {/* Comparables Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Comparables</h3>
                <div className="space-y-4">
                  {formData.comps.map((comp, index) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <Input
                          placeholder="Comp Address"
                          value={comp.address}
                          onChange={(e) => updateComp(index, 'address', e.target.value)}
                          className="bg-white border-gray-200"
                        />
                        <Input
                          placeholder="Zillow Link (optional)"
                          value={comp.zillowLink}
                          onChange={(e) => updateComp(index, 'zillowLink', e.target.value)}
                          className="bg-white border-gray-200"
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <Input
                          placeholder="Beds"
                          value={comp.bedrooms}
                          onChange={(e) => updateComp(index, 'bedrooms', e.target.value)}
                          className="bg-white border-gray-200"
                        />
                        <Input
                          placeholder="Baths"
                          value={comp.bathrooms}
                          onChange={(e) => updateComp(index, 'bathrooms', e.target.value)}
                          className="bg-white border-gray-200"
                        />
                        <Input
                          placeholder="Sq Ft"
                          value={comp.squareFootage}
                          onChange={(e) => updateComp(index, 'squareFootage', e.target.value)}
                          className="bg-white border-gray-200"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact Info Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Contact Info</h3>
                <div className="space-y-4">
                  <Input
                    placeholder="Name"
                    value={formData.contactName}
                    onChange={(e) => updateFormData('contactName', e.target.value)}
                    className="bg-gray-50 border-gray-200"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      placeholder="Phone"
                      value={formData.contactPhone}
                      onChange={(e) => updateFormData('contactPhone', e.target.value)}
                      className="bg-gray-50 border-gray-200"
                    />
                    <Input
                      placeholder="Email (optional)"
                      value={formData.contactEmail}
                      onChange={(e) => updateFormData('contactEmail', e.target.value)}
                      className="bg-gray-50 border-gray-200"
                    />
                  </div>
                  <Input
                    placeholder="EMD Amount"
                    value={formData.emdAmount}
                    onChange={(e) => updateFormData('emdAmount', e.target.value)}
                    className="bg-gray-50 border-gray-200"
                  />
                </div>
              </div>

              {/* Generate Button */}
              <Button 
                onClick={handleGeneratePDF}
                disabled={isGenerating}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold"
              >
                {isGenerating ? 'GENERATING...' : 'GENERATE LISTING'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;