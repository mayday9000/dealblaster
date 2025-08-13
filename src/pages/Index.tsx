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
import { CalendarIcon, Download, FileText, DollarSign, Home, MapPin, Phone, Mail, Building, Calculator, Plus, Minus, Wrench, Users, Lock, Upload, User, Sparkles, ArrowLeft } from 'lucide-react';
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
  const [htmlContent, setHtmlContent] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

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
      // Convert files to base64 for JSON transmission
      let frontPhotoBase64: string | null = null;
      let contactImageBase64: string | null = null;
      
      if (formData.frontPhoto) {
        frontPhotoBase64 = await convertFileToBase64(formData.frontPhoto);
      }
      
      if (formData.contactImage) {
        contactImageBase64 = await convertFileToBase64(formData.contactImage);
      }

      // Prepare data for webhook
      const webhookData = {
        ...formData,
        frontPhoto: frontPhotoBase64,
        contactImage: contactImageBase64,
        title: formData.selectedTitle || formData.generatedTitles[0] || `${formData.city} ${formData.dealType} Opportunity`,
        subtitle: `${formData.dealType} Investment Property - ${formData.address}`
      };

      // Send data to webhook with 60 second timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout

      const response = await fetch('https://mayday.app.n8n.cloud/webhook-test/dealblaster', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookData),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const htmlResult = await response.text();
      setHtmlContent(htmlResult);
      setShowPreview(true);
      
      toast({
        title: "Flyer Generated Successfully!",
        description: "Your property flyer is ready for preview.",
      });
    } catch (error) {
      console.error('Error generating flyer:', error);
      toast({
        title: "Error Generating Flyer",
        description: "Please try again or contact support.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // HTML Preview Component
  const HtmlPreview = () => (
    <div className="min-h-screen bg-white">
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-4 border-b">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Button
            onClick={() => {
              setShowPreview(false);
              setHtmlContent(null);
            }}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Form
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Property Flyer Preview</h1>
        </div>
      </div>
      
      <div className="w-full h-full">
        {htmlContent && (
          <div 
            dangerouslySetInnerHTML={{ __html: htmlContent }}
            className="w-full"
          />
        )}
      </div>
    </div>
  );

  // Show preview if we have HTML content and showPreview is true
  if (showPreview && htmlContent) {
    return <HtmlPreview />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-2">
            <Building className="h-8 w-8 text-blue-600" />
            Property Flyer Generator
          </h1>
          <p className="text-lg text-gray-600">
            Create professional investment property flyers in minutes
          </p>
        </div>

        <div className="grid gap-6">
          {/* Listing Headline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Listing Headline
              </CardTitle>
              <CardDescription>AI-powered headline generation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    placeholder="Raleigh"
                    value={formData.city}
                    onChange={(e) => updateFormData('city', e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="dealType">Deal Type *</Label>
                  <Select value={formData.dealType} onValueChange={(value) => updateFormData('dealType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select deal type" />
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
                  <Label htmlFor="hook">Key Hook/Profit Angle</Label>
                  <Input
                    id="hook"
                    placeholder="$60K spread, vacant, turnkey"
                    value={formData.hook}
                    onChange={(e) => updateFormData('hook', e.target.value)}
                  />
                </div>
              </div>
              
              <Button 
                onClick={generateTitles} 
                variant="outline" 
                className="w-full"
                disabled={!formData.city || !formData.dealType}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Generate AI Titles
              </Button>
              
              {formData.generatedTitles.length > 0 && (
                <div className="space-y-3">
                  <Label>Select or Edit Title:</Label>
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
                        className="flex-1"
                      />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="address">Full Property Address *</Label>
                <Input
                  id="address"
                  placeholder="1309 Plymouth Ct, Raleigh, NC 27610"
                  value={formData.address}
                  onChange={(e) => updateFormData('address', e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="askingPrice">Asking Price *</Label>
                  <Input
                    id="askingPrice"
                    placeholder="$195,000"
                    value={formData.askingPrice}
                    onChange={(e) => updateFormData('askingPrice', e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="closingDate">Closing Date/Deadline *</Label>
                  <Input
                    id="closingDate"
                    placeholder="mm/dd/yyyy or 'flexible'"
                    value={formData.closingDate}
                    onChange={(e) => updateFormData('closingDate', e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <Label>Financing Types Accepted *</Label>
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
            </CardContent>
          </Card>

          {/* Photo Section */}
          <Card>
            <CardHeader>
              <CardTitle>Property Photos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="photoLink">Drive/Dropbox Photo Folder Link *</Label>
                <Input
                  id="photoLink"
                  placeholder="https://drive.google.com/folder/..."
                  value={formData.photoLink}
                  onChange={(e) => updateFormData('photoLink', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="frontPhoto">Upload Front Photo (Optional)</Label>
                <Input
                  id="frontPhoto"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    updateFormData('frontPhoto', file);
                  }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Property Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="h-5 w-5" />
                Property Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="bedrooms">Bedrooms *</Label>
                <Input
                  id="bedrooms"
                  value={formData.bedrooms}
                  onChange={(e) => updateFormData('bedrooms', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="bathrooms">Bathrooms *</Label>
                <Input
                  id="bathrooms"
                  value={formData.bathrooms}
                  onChange={(e) => updateFormData('bathrooms', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="squareFootage">Square Footage *</Label>
                <Input
                  id="squareFootage"
                  value={formData.squareFootage}
                  onChange={(e) => updateFormData('squareFootage', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="yearBuilt">Year Built *</Label>
                <Input
                  id="yearBuilt"
                  value={formData.yearBuilt}
                  onChange={(e) => updateFormData('yearBuilt', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="zoning">Zoning (Optional)</Label>
                <Input
                  id="zoning"
                  placeholder="R-6"
                  value={formData.zoning}
                  onChange={(e) => updateFormData('zoning', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="lotSize">Lot Size (Optional)</Label>
                <Input
                  id="lotSize"
                  placeholder="0.25 acres"
                  value={formData.lotSize}
                  onChange={(e) => updateFormData('lotSize', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="foundationType">Foundation Type</Label>
                <Select value={formData.foundationType} onValueChange={(value) => updateFormData('foundationType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select foundation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Slab">Slab</SelectItem>
                    <SelectItem value="Crawl">Crawl</SelectItem>
                    <SelectItem value="Basement">Basement</SelectItem>
                    <SelectItem value="Unknown">Unknown</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="garage">Garage</Label>
                <Input
                  id="garage"
                  placeholder="2-car garage or None"
                  value={formData.garage}
                  onChange={(e) => updateFormData('garage', e.target.value)}
                />
              </div>
              
              <div className="md:col-span-2">
                <Label>Utilities</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                  {['City Water', 'Sewer', 'Septic', 'Well'].map((utility) => (
                    <div key={utility} className="flex items-center space-x-2">
                      <Checkbox
                        id={`utility-${utility}`}
                        checked={formData.utilities.includes(utility)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            updateFormData('utilities', [...formData.utilities, utility]);
                          } else {
                            updateFormData('utilities', formData.utilities.filter(u => u !== utility));
                          }
                        }}
                      />
                      <Label htmlFor={`utility-${utility}`}>{utility}</Label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="md:col-span-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="pool"
                    checked={formData.pool}
                    onCheckedChange={(checked) => updateFormData('pool', checked)}
                  />
                  <Label htmlFor="pool">Pool</Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Big Ticket Systems */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="h-5 w-5" />
                Big Ticket Systems
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Roof */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Roof</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Age *</Label>
                    <Select value={formData.roofAge} onValueChange={(value) => updateFormData('roofAge', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select age range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="<5">Less than 5 years</SelectItem>
                        <SelectItem value="5-10">5-10 years</SelectItem>
                        <SelectItem value="10-15">10-15 years</SelectItem>
                        <SelectItem value="15+">15+ years</SelectItem>
                        <SelectItem value="Unknown">Unknown</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>Condition *</Label>
                    <Select value={formData.roofCondition} onValueChange={(value) => updateFormData('roofCondition', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Working">Working</SelectItem>
                        <SelectItem value="Leaking">Leaking</SelectItem>
                        <SelectItem value="Needs Replacement">Needs Replacement</SelectItem>
                        <SelectItem value="Unknown">Unknown</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>Specific Age/Year (Optional)</Label>
                    <Input
                      placeholder="2019 or 5 years"
                      value={formData.roofSpecificAge}
                      onChange={(e) => updateFormData('roofSpecificAge', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label>Last Serviced (Optional)</Label>
                    <Input
                      placeholder="mm/yyyy"
                      value={formData.roofLastServiced}
                      onChange={(e) => updateFormData('roofLastServiced', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* HVAC */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">HVAC</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Age *</Label>
                    <Select value={formData.hvacAge} onValueChange={(value) => updateFormData('hvacAge', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select age range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="<5">Less than 5 years</SelectItem>
                        <SelectItem value="5-10">5-10 years</SelectItem>
                        <SelectItem value="10-15">10-15 years</SelectItem>
                        <SelectItem value="15+">15+ years</SelectItem>
                        <SelectItem value="Unknown">Unknown</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>Condition *</Label>
                    <Select value={formData.hvacCondition} onValueChange={(value) => updateFormData('hvacCondition', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Working">Working</SelectItem>
                        <SelectItem value="Leaking">Leaking</SelectItem>
                        <SelectItem value="Needs Replacement">Needs Replacement</SelectItem>
                        <SelectItem value="Unknown">Unknown</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>Specific Age/Year (Optional)</Label>
                    <Input
                      placeholder="2019 or 5 years"
                      value={formData.hvacSpecificAge}
                      onChange={(e) => updateFormData('hvacSpecificAge', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label>Last Serviced (Optional)</Label>
                    <Input
                      placeholder="mm/yyyy"
                      value={formData.hvacLastServiced}
                      onChange={(e) => updateFormData('hvacLastServiced', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Water Heater */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Water Heater</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Age *</Label>
                    <Select value={formData.waterHeaterAge} onValueChange={(value) => updateFormData('waterHeaterAge', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select age range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="<5">Less than 5 years</SelectItem>
                        <SelectItem value="5-10">5-10 years</SelectItem>
                        <SelectItem value="10-15">10-15 years</SelectItem>
                        <SelectItem value="15+">15+ years</SelectItem>
                        <SelectItem value="Unknown">Unknown</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>Condition *</Label>
                    <Select value={formData.waterHeaterCondition} onValueChange={(value) => updateFormData('waterHeaterCondition', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Working">Working</SelectItem>
                        <SelectItem value="Leaking">Leaking</SelectItem>
                        <SelectItem value="Needs Replacement">Needs Replacement</SelectItem>
                        <SelectItem value="Unknown">Unknown</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>Specific Age/Year (Optional)</Label>
                    <Input
                      placeholder="2019 or 5 years"
                      value={formData.waterHeaterSpecificAge}
                      onChange={(e) => updateFormData('waterHeaterSpecificAge', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label>Last Serviced (Optional)</Label>
                    <Input
                      placeholder="mm/yyyy"
                      value={formData.waterHeaterLastServiced}
                      onChange={(e) => updateFormData('waterHeaterLastServiced', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Occupancy */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Occupancy
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Current Occupancy *</Label>
                <Select value={formData.currentOccupancy} onValueChange={(value) => updateFormData('currentOccupancy', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select current occupancy" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Owner">Owner</SelectItem>
                    <SelectItem value="Tenant">Tenant</SelectItem>
                    <SelectItem value="Vacant">Vacant</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Occupancy at Closing *</Label>
                <Select value={formData.closingOccupancy} onValueChange={(value) => updateFormData('closingOccupancy', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select closing occupancy" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Owner">Owner</SelectItem>
                    <SelectItem value="Tenant">Tenant</SelectItem>
                    <SelectItem value="Vacant">Vacant</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Financial Snapshot */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Financial Snapshot
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeFinancialBreakdown"
                  checked={formData.includeFinancialBreakdown}
                  onCheckedChange={(checked) => updateFormData('includeFinancialBreakdown', checked)}
                />
                <Label htmlFor="includeFinancialBreakdown">Include Financial Breakdown</Label>
              </div>
              
              {formData.includeFinancialBreakdown && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="arv">ARV</Label>
                      <Input
                        id="arv"
                        placeholder="$300,000"
                        value={formData.arv}
                        onChange={(e) => updateFormData('arv', e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="rehabEstimate">Rehab Estimate</Label>
                      <Input
                        id="rehabEstimate"
                        placeholder="$50,000"
                        value={formData.rehabEstimate}
                        onChange={(e) => updateFormData('rehabEstimate', e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="allIn">All-In Cost</Label>
                      <Input
                        id="allIn"
                        placeholder="$245,000"
                        value={formData.allIn}
                        onChange={(e) => updateFormData('allIn', e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="grossProfit">Gross Profit</Label>
                      <Input
                        id="grossProfit"
                        placeholder="$55,000"
                        value={formData.grossProfit}
                        onChange={(e) => updateFormData('grossProfit', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="exitStrategy">Exit Strategy</Label>
                    <Textarea
                      id="exitStrategy"
                      placeholder="Full renovation with modern finishes..."
                      value={formData.exitStrategy}
                      onChange={(e) => updateFormData('exitStrategy', e.target.value)}
                      rows={3}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Comps */}
          <Card>
            <CardHeader>
              <CardTitle>Comparable Sales</CardTitle>
              <CardDescription>Add at least 2 comparable properties</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {formData.comps.map((comp, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-4">
                  <div className="flex justify-between items-center">
                    <Label className="text-base font-semibold">Comp {index + 1}</Label>
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
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Address *</Label>
                      <Input
                        placeholder="123 Main St, City, NC"
                        value={comp.address}
                        onChange={(e) => updateComp(index, 'address', e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <Label>Zillow Link (Optional)</Label>
                      <Input
                        placeholder="https://zillow.com/..."
                        value={comp.zillowLink}
                        onChange={(e) => updateComp(index, 'zillowLink', e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <Label>Bedrooms *</Label>
                      <Input
                        value={comp.bedrooms}
                        onChange={(e) => updateComp(index, 'bedrooms', e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <Label>Bathrooms *</Label>
                      <Input
                        value={comp.bathrooms}
                        onChange={(e) => updateComp(index, 'bathrooms', e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <Label>Square Feet *</Label>
                      <Input
                        value={comp.squareFootage}
                        onChange={(e) => updateComp(index, 'squareFootage', e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <Label>Comp Type *</Label>
                      <Select value={comp.compType} onValueChange={(value) => updateComp(index, 'compType', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
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
                      <Label>Condition Label (Optional)</Label>
                      <Input
                        placeholder="Flip, Turnkey, Full Gut"
                        value={comp.conditionLabel}
                        onChange={(e) => updateComp(index, 'conditionLabel', e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <Label>Asset Type *</Label>
                      <Select value={comp.assetType} onValueChange={(value) => updateComp(index, 'assetType', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select asset type" />
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
              
              <Button type="button" variant="outline" onClick={addComp} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add Another Comp
              </Button>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="contactName">Full Name *</Label>
                    <Input
                      id="contactName"
                      value={formData.contactName}
                      onChange={(e) => updateFormData('contactName', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="contactPhone">Phone Number *</Label>
                    <Input
                      id="contactPhone"
                      value={formData.contactPhone}
                      onChange={(e) => updateFormData('contactPhone', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="contactEmail">Email (Optional)</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      value={formData.contactEmail}
                      onChange={(e) => updateFormData('contactEmail', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="officeNumber">Office Number (Optional)</Label>
                    <Input
                      id="officeNumber"
                      value={formData.officeNumber}
                      onChange={(e) => updateFormData('officeNumber', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="businessHours">Business Hours (Optional)</Label>
                    <Input
                      id="businessHours"
                      placeholder="Mon-Fri, 9AM-5PM"
                      value={formData.businessHours}
                      onChange={(e) => updateFormData('businessHours', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="website">Website (Optional)</Label>
                    <Input
                      id="website"
                      placeholder="https://yourwebsite.com"
                      value={formData.website}
                      onChange={(e) => updateFormData('website', e.target.value)}
                    />
                  </div>
                </div>

                {/* Profile Image Section */}
                <div className="flex flex-col items-center space-y-3">
                  <Label className="text-sm font-medium">Headshot (Optional)</Label>
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center overflow-hidden">
                      {formData.contactImage ? (
                        <img
                          src={URL.createObjectURL(formData.contactImage)}
                          alt="Profile preview"
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        <User className="w-8 h-8 text-gray-400" />
                      )}
                    </div>
                    <input
                      type="file"
                      id="contactImage"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        updateFormData('contactImage', file);
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="absolute -bottom-2 left-1/2 transform -translate-x-1/2"
                      onClick={() => document.getElementById('contactImage')?.click()}
                    >
                      <Upload className="w-3 h-3 mr-1" />
                      {formData.contactImage ? 'Change' : 'Upload'}
                    </Button>
                  </div>
                  {formData.contactImage && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => updateFormData('contactImage', null)}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Legal Disclosures */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Legal Disclosures
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="emdAmount">EMD Amount *</Label>
                  <Input
                    id="emdAmount"
                    placeholder="$5,000"
                    value={formData.emdAmount}
                    onChange={(e) => updateFormData('emdAmount', e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="emdDueDate">EMD Due Date</Label>
                  <Input
                    id="emdDueDate"
                    placeholder="mm/dd/yyyy"
                    value={formData.emdDueDate}
                    onChange={(e) => updateFormData('emdDueDate', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="memoFiled"
                    checked={formData.memoFiled}
                    onCheckedChange={(checked) => updateFormData('memoFiled', checked)}
                  />
                  <Label htmlFor="memoFiled">Memo of Contract Filed?</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="postPossession"
                    checked={formData.postPossession}
                    onCheckedChange={(checked) => updateFormData('postPossession', checked)}
                  />
                  <Label htmlFor="postPossession">Post-possession disclosure?</Label>
                </div>
              </div>
              
              <div>
                <Label htmlFor="additionalDisclosures">Additional Disclosures/Notes</Label>
                <Textarea
                  id="additionalDisclosures"
                  placeholder="Any additional deal-specific notes or disclosures..."
                  value={formData.additionalDisclosures}
                  onChange={(e) => updateFormData('additionalDisclosures', e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Generate PDF Button */}
          <Card>
            <CardContent className="pt-6">
              <Button 
                onClick={handleGeneratePDF} 
                disabled={isGenerating}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Generating Flyer...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-5 w-5" />
                    Generate Professional Flyer
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;