import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Download, FileText, DollarSign, Home, MapPin, Phone, Mail, Building, Calculator, Plus, Minus, Wrench, Users, Lock, Upload, User, Sparkles } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import { generatePDF } from '@/utils/pdfGenerator';

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
    financingTypes: [],
    closingDate: '',
    
    // Photo Section
    photoLink: '',
    frontPhoto: null,
    
    // Property Overview
    bedrooms: '',
    bathrooms: '',
    squareFootage: '',
    yearBuilt: '',
    zoning: '',
    lotSize: '',
    foundationType: '',
    utilities: [],
    garage: '',
    pool: false,
    
    // Big Ticket Systems
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
    
    // Occupancy
    currentOccupancy: '',
    closingOccupancy: '',
    
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
        compType: '',
        conditionLabel: '',
        assetType: '',
      },
      {
        address: '',
        zillowLink: '',
        bedrooms: '',
        bathrooms: '',
        squareFootage: '',
        compType: '',
        conditionLabel: '',
        assetType: '',
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

  const addComp = () => {
    setFormData(prev => ({
      ...prev,
      comps: [...prev.comps, {
        address: '',
        zillowLink: '',
        bedrooms: '',
        bathrooms: '',
        squareFootage: '',
        compType: '',
        conditionLabel: '',
        assetType: '',
      }]
    }));
  };

  const removeComp = (index: number) => {
    if (formData.comps.length > 2) {
      setFormData(prev => ({
        ...prev,
        comps: prev.comps.filter((_, i) => i !== index)
      }));
    }
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

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const validateRequiredFields = () => {
    const errors = [];
    
    if (!formData.city) errors.push('City');
    if (!formData.dealType) errors.push('Deal Type');
    if (!formData.address) errors.push('Full Address');
    if (!formData.askingPrice) errors.push('Asking Price');
    if (!formData.financingTypes.length) errors.push('Financing Types');
    if (!formData.closingDate) errors.push('Closing Date');
    if (!formData.photoLink) errors.push('Photo Link');
    if (!formData.bedrooms) errors.push('Bedrooms');
    if (!formData.bathrooms) errors.push('Bathrooms');
    if (!formData.squareFootage) errors.push('Square Footage');
    if (!formData.yearBuilt) errors.push('Year Built');
    if (!formData.roofAge) errors.push('Roof Age');
    if (!formData.roofCondition) errors.push('Roof Condition');
    if (!formData.hvacAge) errors.push('HVAC Age');
    if (!formData.hvacCondition) errors.push('HVAC Condition');
    if (!formData.waterHeaterAge) errors.push('Water Heater Age');
    if (!formData.waterHeaterCondition) errors.push('Water Heater Condition');
    if (!formData.currentOccupancy) errors.push('Current Occupancy');
    if (!formData.closingOccupancy) errors.push('Closing Occupancy');
    if (!formData.contactName) errors.push('Contact Name');
    if (!formData.contactPhone) errors.push('Contact Phone');
    if (!formData.emdAmount) errors.push('EMD Amount');
    
    // Validate at least 2 comps with required fields
    const validComps = formData.comps.filter(comp => 
      comp.address && comp.bedrooms && comp.bathrooms && comp.squareFootage && comp.compType && comp.assetType
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
      // Convert contact image to base64 if it exists
      let contactImageBase64: string | null = null;
      if (formData.contactImage) {
        contactImageBase64 = await convertFileToBase64(formData.contactImage);
      }
      
      await generatePDF({
        ...formData,
        contactImage: contactImageBase64,
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
        {/* Header with DealBlaster Branding */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            {/* Paper plane icon */}
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center transform -rotate-12">
              <div className="w-6 h-6 bg-white" style={{
                clipPath: 'polygon(0% 0%, 100% 50%, 0% 100%)'
              }}></div>
            </div>
            {/* Box icon */}
            <div className="w-12 h-12 bg-orange-400 rounded-lg flex items-center justify-center">
              <div className="w-8 h-6 border-2 border-orange-700 bg-orange-300 rounded-sm"></div>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            <span className="text-gray-900">DEAL</span><span className="text-blue-500">BLASTER</span>
          </h1>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Listings Fast</h2>
          <p className="text-lg text-gray-600">
            The quickest way to blast out off-market deals.
          </p>
        </div>

        {/* Single Form Card */}
        <Card className="bg-white shadow-lg rounded-lg border border-gray-200">
          <CardContent className="p-8 space-y-8">
            
            {/* Property Details Section */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Property Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Input
                    placeholder="City"
                    value={formData.city}
                    onChange={(e) => updateFormData('city', e.target.value)}
                    className="h-12 rounded-lg border-gray-300"
                  />
                </div>
                
                <div>
                  <Select value={formData.dealType} onValueChange={(value) => updateFormData('dealType', value)}>
                    <SelectTrigger className="h-12 rounded-lg border-gray-300">
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
                    className="h-12 rounded-lg border-gray-300"
                  />
                </div>
                
                <div>
                  <Input
                    placeholder="Close Date"
                    value={formData.closingDate}
                    onChange={(e) => updateFormData('closingDate', e.target.value)}
                    className="h-12 rounded-lg border-gray-300"
                  />
                </div>
              </div>
              
              <div>
                <Input
                  placeholder="Full Property Address"
                  value={formData.address}
                  onChange={(e) => updateFormData('address', e.target.value)}
                  className="h-12 rounded-lg border-gray-300"
                />
              </div>
              
              <div>
                <Input
                  placeholder="Drive/Dropbox Photo Folder Link"
                  value={formData.photoLink}
                  onChange={(e) => updateFormData('photoLink', e.target.value)}
                  className="h-12 rounded-lg border-gray-300"
                />
              </div>
              
              <div>
                <Input
                  placeholder="Key Hook/Profit Angle"
                  value={formData.hook}
                  onChange={(e) => updateFormData('hook', e.target.value)}
                  className="h-12 rounded-lg border-gray-300"
                />
              </div>
              
              <div>
                <Label>Financing Types Accepted</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                  {['Cash', 'Conventional', 'FHA', 'VA', 'As-Is', 'Other'].map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox
                        id={`financing-${type}`}
                        checked={formData.financingTypes.includes(type)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            updateFormData('financingTypes', [...formData.financingTypes, type]);
                          } else {
                            updateFormData('financingTypes', formData.financingTypes.filter(t => t !== type));
                          }
                        }}
                      />
                      <Label htmlFor={`financing-${type}`}>{type}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Specifications Section */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Specifications</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Input
                    placeholder="Beds"
                    value={formData.bedrooms}
                    onChange={(e) => updateFormData('bedrooms', e.target.value)}
                    className="h-12 rounded-lg border-gray-300"
                  />
                </div>
                
                <div>
                  <Input
                    placeholder="Baths"
                    value={formData.bathrooms}
                    onChange={(e) => updateFormData('bathrooms', e.target.value)}
                    className="h-12 rounded-lg border-gray-300"
                  />
                </div>
              </div>
              
              <div>
                <Input
                  placeholder="Sq Ft"
                  value={formData.squareFootage}
                  onChange={(e) => updateFormData('squareFootage', e.target.value)}
                  className="h-12 rounded-lg border-gray-300"
                />
              </div>
              
              <div>
                <Input
                  placeholder="Year Built"
                  value={formData.yearBuilt}
                  onChange={(e) => updateFormData('yearBuilt', e.target.value)}
                  className="h-12 rounded-lg border-gray-300"
                />
              </div>
            </div>

            {/* Comparables Section */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Comparables</h3>
              
              {formData.comps.map((comp, index) => (
                <div key={index} className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label className="text-base font-medium">Comp {index + 1}</Label>
                    {formData.comps.length > 2 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeComp(index)}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  
                  <div>
                    <Input
                      placeholder="Comp Address"
                      value={comp.address}
                      onChange={(e) => updateComp(index, 'address', e.target.value)}
                      className="h-12 rounded-lg border-gray-300"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Input
                        placeholder="Beds"
                        value={comp.bedrooms}
                        onChange={(e) => updateComp(index, 'bedrooms', e.target.value)}
                        className="h-12 rounded-lg border-gray-300"
                      />
                    </div>
                    
                    <div>
                      <Input
                        placeholder="Baths"
                        value={comp.bathrooms}
                        onChange={(e) => updateComp(index, 'bathrooms', e.target.value)}
                        className="h-12 rounded-lg border-gray-300"
                      />
                    </div>
                    
                    <div>
                      <Input
                        placeholder="Sq Ft"
                        value={comp.squareFootage}
                        onChange={(e) => updateComp(index, 'squareFootage', e.target.value)}
                        className="h-12 rounded-lg border-gray-300"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Select value={comp.compType} onValueChange={(value) => updateComp(index, 'compType', value)}>
                        <SelectTrigger className="h-12 rounded-lg border-gray-300">
                          <SelectValue placeholder="Comp Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Flip Comp">Flip Comp</SelectItem>
                          <SelectItem value="Cash Comp">Cash Comp</SelectItem>
                          <SelectItem value="Pending">Pending</SelectItem>
                          <SelectItem value="Active">Active</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Select value={comp.assetType} onValueChange={(value) => updateComp(index, 'assetType', value)}>
                        <SelectTrigger className="h-12 rounded-lg border-gray-300">
                          <SelectValue placeholder="Asset Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Residential">Residential</SelectItem>
                          <SelectItem value="Multi-Family">Multi-Family</SelectItem>
                          <SelectItem value="Land">Land</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              ))}
              
              <Button type="button" variant="outline" onClick={addComp} className="w-full h-12 rounded-lg">
                <Plus className="w-4 h-4 mr-2" />
                Add Another Comp
              </Button>
            </div>

            {/* Contact Info Section */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Contact Info</h3>
              
              <div>
                <Input
                  placeholder="Name"
                  value={formData.contactName}
                  onChange={(e) => updateFormData('contactName', e.target.value)}
                  className="h-12 rounded-lg border-gray-300"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Input
                    placeholder="Phone"
                    value={formData.contactPhone}
                    onChange={(e) => updateFormData('contactPhone', e.target.value)}
                    className="h-12 rounded-lg border-gray-300"
                  />
                </div>
                
                <div>
                  <Input
                    placeholder="Email (Optional)"
                    value={formData.contactEmail}
                    onChange={(e) => updateFormData('contactEmail', e.target.value)}
                    className="h-12 rounded-lg border-gray-300"
                  />
                </div>
              </div>
              
              <div>
                <Input
                  placeholder="EMD Amount"
                  value={formData.emdAmount}
                  onChange={(e) => updateFormData('emdAmount', e.target.value)}
                  className="h-12 rounded-lg border-gray-300"
                />
              </div>
            </div>

            {/* Hidden fields for all other data - they will be preserved */}
            {/* ... keep existing code (all other form fields preserved in state) */}

            {/* Generate Button */}
            <div className="pt-4">
              <Button 
                onClick={handleGeneratePDF} 
                disabled={isGenerating}
                className="w-full h-14 bg-blue-500 hover:bg-blue-600 text-white text-lg font-semibold rounded-lg"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Generating...
                  </>
                ) : (
                  'GENERATE LISTING'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default Index;