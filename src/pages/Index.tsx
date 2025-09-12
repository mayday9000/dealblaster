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
import SuccessModal from '@/components/SuccessModal';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import { generatePDF } from '@/utils/pdfGenerator';
import { supabase } from '@/integrations/supabase/client';
import { slugify } from '@/utils/slugify';
import { useNavigate } from 'react-router-dom';

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
  closingDateType: 'exact' | 'onBefore';
  
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
  garageType: 'attached' | 'detached' | '';
  pool: boolean;
  
  // Big Ticket Systems
  bigTicketItems: Array<{
    type: string;
    age: string;
    ageType: 'range' | 'specific';
    specificYear: string;
    condition: string;
    lastServiced: string;
  }>;
  
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
  comps: Array<{
    address: string;
    zillowLink: string;
    bedrooms: string;
    bathrooms: string;
    squareFootage: string;
    lotSize: string;
    compType: string;
    conditionLabel: string;
    assetType: string;
    assetTypeOther: string;
    status: string;
    soldListedPrice: string;
    soldListedDate: string;
    pendingDate: string;
    rentPrice: string;
  }>;
  
  // Contact Info
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  officeNumber: string;
  businessHoursStart: string;
  businessHoursEnd: string;
  businessHoursTimezone: string;
  contactImage: File | null;
  companyLogo: File | null;
  website: string;
  
  // Legal Disclosures
  emdAmount: string;
  emdDueDate: string;
  postPossession: boolean;
  additionalDisclosures: string;
}

const Index = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    // Listing Headline
    city: '',
    state: '',
    zip: '',
    dealType: '',
    hook: '',
    generatedTitles: [],
    selectedTitle: '',
    isPremarket: false,
    
    // Basic Info
    address: '',
    askingPrice: '',
    financingTypes: [],
    financingOther: '',
    closingDate: '',
    closingDateType: 'exact',
    
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
    utilitiesOther: '',
    garageSpaces: '',
    garageType: '',
    pool: false,
    
    // Big Ticket Systems
    bigTicketItems: [
      { type: 'Roof', age: '', ageType: 'range', specificYear: '', condition: '', lastServiced: '' },
      { type: 'HVAC', age: '', ageType: 'range', specificYear: '', condition: '', lastServiced: '' },
      { type: 'Water Heater', age: '', ageType: 'range', specificYear: '', condition: '', lastServiced: '' }
    ],
    
    // Occupancy
    occupancy: '',
    occupancyOnDelivery: '',
    
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
        lotSize: '',
        compType: '',
        conditionLabel: '',
        assetType: '',
        assetTypeOther: '',
        status: '',
        soldListedPrice: '',
        soldListedDate: '',
        pendingDate: '',
        rentPrice: '',
      },
      {
        address: '',
        zillowLink: '',
        bedrooms: '',
        bathrooms: '',
        squareFootage: '',
        lotSize: '',
        compType: '',
        conditionLabel: '',
        assetType: '',
        assetTypeOther: '',
        status: '',
        soldListedPrice: '',
        soldListedDate: '',
        pendingDate: '',
        rentPrice: '',
      }
    ],
    
    // Contact Info
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    officeNumber: '',
    businessHoursStart: '',
    businessHoursEnd: '',
    businessHoursTimezone: '',
    contactImage: null,
    companyLogo: null,
    website: '',
    
    // Legal Disclosures
    emdAmount: '',
    emdDueDate: '',
    postPossession: false,
    additionalDisclosures: '',
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [shareUrl, setShareUrl] = useState('');

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
        lotSize: '',
        compType: '',
        conditionLabel: '',
        assetType: '',
        assetTypeOther: '',
        status: '',
        soldListedPrice: '',
        soldListedDate: '',
        pendingDate: '',
        rentPrice: '',
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

  const addBigTicketItem = () => {
    setFormData(prev => ({
      ...prev,
      bigTicketItems: [...prev.bigTicketItems, {
        type: '',
        age: '',
        ageType: 'range',
        specificYear: '',
        condition: '',
        lastServiced: ''
      }]
    }));
  };

  const removeBigTicketItem = (index: number) => {
    if (formData.bigTicketItems.length > 3) {
      setFormData(prev => ({
        ...prev,
        bigTicketItems: prev.bigTicketItems.filter((_, i) => i !== index)
      }));
    }
  };

  const updateBigTicketItem = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      bigTicketItems: prev.bigTicketItems.map((item, i) => 
        i === index ? { 
          ...item, 
          [field]: value,
          // Clear the irrelevant field when ageType changes
          ...(field === 'ageType' && value === 'range' ? { specificYear: '' } : {}),
          ...(field === 'ageType' && value === 'specific' ? { age: '' } : {})
        } : item
      )
    }));
  };

  const generateTitles = () => {
    const city = formData.city || 'Prime Location';
    const dealType = formData.dealType || 'Investment';
    const hook = formData.hook || 'Great Opportunity';
    
    const titles = [
      `${city}, ${formData.state || 'NC'} - ${hook} ${dealType} Deal!`,
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

  const formatAskingPrice = (value: string) => {
    // Remove all non-numeric characters
    const numbers = value.replace(/[^\d]/g, '');
    
    if (numbers === '') return '';
    
    // Format with commas and dollar sign
    const formatted = '$' + parseInt(numbers).toLocaleString();
    return formatted;
  };

  const handleAskingPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatAskingPrice(e.target.value);
    updateFormData('askingPrice', formatted);
  };

  const validateRequiredFields = () => {
    const errors = [];
    
    if (!formData.city) errors.push('City');
    if (!formData.state) errors.push('State');
    if (!formData.dealType) errors.push('Deal Type');
    if (!formData.isPremarket && !formData.address) errors.push('Full Address (unless premarket)');
    if (!formData.askingPrice) errors.push('Asking Price');
    if (!formData.financingTypes.length) errors.push('Financing Types');
    if (!formData.closingDate) errors.push('Closing Date');
    if (!formData.photoLink) errors.push('Photo Link');
    if (!formData.bedrooms) errors.push('Bedrooms');
    if (!formData.bathrooms) errors.push('Bathrooms');
    if (!formData.squareFootage) errors.push('Square Footage');
    if (!formData.yearBuilt) errors.push('Year Built');
    if (!formData.occupancy) errors.push('Occupancy');
    if (!formData.occupancyOnDelivery) errors.push('Occupancy on Delivery');
    if (!formData.contactName) errors.push('Contact Name');
    if (!formData.contactPhone) errors.push('Contact Phone');
    
    // Validate big ticket systems (at least first 3 required items)
    const requiredBigTicketTypes = ['Roof', 'HVAC', 'Water Heater'];
    for (const requiredType of requiredBigTicketTypes) {
      const item = formData.bigTicketItems.find(item => item.type === requiredType);
      if (!item || !item.condition) {
        errors.push(`${requiredType} year/range and condition`);
      } else if (item.ageType === 'range' && !item.age) {
        errors.push(`${requiredType} year/range and condition`);
      } else if (item.ageType === 'specific' && (!item.specificYear || !/^\d{4}$/.test(item.specificYear))) {
        errors.push(`${requiredType} year/range and condition`);
      }
    }
    
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
      let companyLogoBase64: string | null = null;
      
      if (formData.frontPhoto) {
        frontPhotoBase64 = await convertFileToBase64(formData.frontPhoto);
      }
      
      if (formData.contactImage) {
        contactImageBase64 = await convertFileToBase64(formData.contactImage);
      }

      if (formData.companyLogo) {
        companyLogoBase64 = await convertFileToBase64(formData.companyLogo);
      }

      // Create address slug
      const addressSlug = formData.isPremarket ? 
        slugify(`${formData.city}-${formData.state}-premarket-${Date.now()}`) :
        slugify(formData.address);

      // Prepare data for webhook
      const webhookData = {
        ...formData,
        frontPhoto: frontPhotoBase64,
        contactImage: contactImageBase64,
        companyLogo: companyLogoBase64,
        title: formData.selectedTitle || formData.generatedTitles[0] || `${formData.city} ${formData.dealType} Opportunity`,
        subtitle: `${formData.dealType} Investment Property - ${formData.isPremarket ? `${formData.city}, ${formData.state}` : formData.address}`
      };

      // Create garage display string
      const garageDisplay = formData.garageSpaces ? 
        `${formData.garageType} ${formData.garageSpaces}-car garage` : '';

      // Create business hours display string
      const businessHoursDisplay = formData.businessHoursStart && formData.businessHoursEnd && formData.businessHoursTimezone ?
        `${formData.businessHoursStart} - ${formData.businessHoursEnd} ${formData.businessHoursTimezone}` : '';

      // First, save property data to Supabase WITHOUT html_content
      const propertyData = {
        address_slug: addressSlug,
        html_content: null, // Will be updated after webhook returns
        city: formData.city,
        deal_type: formData.dealType,
        hook: formData.hook,
        generated_titles: formData.generatedTitles,
        selected_title: formData.selectedTitle,
        address: formData.address,
        asking_price: formData.askingPrice,
        financing_types: formData.financingTypes,
        closing_date: formData.closingDate,
        photo_link: formData.photoLink,
        front_photo: frontPhotoBase64,
        bedrooms: formData.bedrooms,
        bathrooms: formData.bathrooms,
        square_footage: formData.squareFootage,
        year_built: formData.yearBuilt,
        zoning: formData.zoning,
        lot_size: formData.lotSize,
        foundation_type: formData.foundationType,
        utilities: Array.isArray(formData.utilities) ? formData.utilities.join(', ') : formData.utilities,
        garage: garageDisplay,
        pool: formData.pool ? 'Yes' : 'No',
        current_occupancy: formData.occupancy,
        closing_occupancy: formData.occupancyOnDelivery,
        include_financial_breakdown: formData.includeFinancialBreakdown,
        arv: formData.arv,
        rehab_estimate: formData.rehabEstimate,
        all_in: formData.allIn,
        gross_profit: formData.grossProfit,
        exit_strategy: formData.exitStrategy,
        comps: formData.comps,
        contact_name: formData.contactName,
        contact_phone: formData.contactPhone,
        contact_email: formData.contactEmail,
        office_number: formData.officeNumber,
        business_hours: businessHoursDisplay,
        contact_image: contactImageBase64,
        website: formData.website,
        emd_amount: formData.emdAmount,
        emd_due_date: formData.emdDueDate,
        post_possession: formData.postPossession ? 'Yes' : 'No',
        additional_disclosures: formData.additionalDisclosures,
      };

      // Log the JSON payload being sent to webhook
      console.log('Webhook JSON payload:', JSON.stringify(webhookData, null, 2));

      // Send data to webhook with no timeout - wait as long as needed
      const response = await fetch('https://mayday.app.n8n.cloud/webhook/dealblaster', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const htmlResult = await response.text();
      console.log('HTML result received from webhook');

      // Save only the HTML content and basic identifiers to Supabase
      const propertyRecord = {
        address_slug: addressSlug,
        html_content: htmlResult,
        city: formData.city,
        deal_type: formData.dealType,
        address: formData.address,
      };

      const { data: insertResult, error: supabaseError } = await supabase
        .from('properties')
        .upsert(propertyRecord, { 
          onConflict: 'address_slug',
          ignoreDuplicates: false 
        })
        .select();

      if (supabaseError) {
        console.error('Supabase error:', supabaseError);
        throw new Error('Failed to save generated HTML');
      }

      console.log('HTML content saved successfully to Supabase:', insertResult);
      
      // Create share URL and show success modal
      const shareLink = `/property?address=${encodeURIComponent(addressSlug)}`;
      setShareUrl(shareLink);
      setShowSuccessModal(true);
      
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

  const copyShareUrl = async () => {
    const fullUrl = `${window.location.origin}${shareUrl}`;
    try {
      await navigator.clipboard.writeText(fullUrl);
      toast({
        title: "Link copied!",
        description: "Share URL copied to clipboard.",
      });
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Please copy the URL manually.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-2">
            <Building className="h-8 w-8 text-blue-600" />
            Property Flyer Generator
          </h1>
          <p className="text-gray-600">Create professional investment property flyers in minutes</p>
        </div>

        <div className="space-y-6">
          {/* Listing Headline Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Listing Headline
              </CardTitle>
              <CardDescription>Create an eye-catching title for your property listing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    placeholder="Hudson"
                    value={formData.city}
                    onChange={(e) => updateFormData('city', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="state">State *</Label>
                  <Input
                    id="state"
                    placeholder="FL"
                    value={formData.state}
                    onChange={(e) => updateFormData('state', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="zip">Zip Code (Optional for Premarket)</Label>
                  <Input
                    id="zip"
                    placeholder="34667"
                    value={formData.zip}
                    onChange={(e) => updateFormData('zip', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="dealType">Deal Type *</Label>
                  <Select value={formData.dealType} onValueChange={(value) => updateFormData('dealType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select deal type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Flip">Flip</SelectItem>
                      <SelectItem value="Wholesale">Wholesale</SelectItem>
                      <SelectItem value="BRRRR">BRRRR</SelectItem>
                      <SelectItem value="Buy & Hold">Buy & Hold</SelectItem>
                      <SelectItem value="Creative Finance">Creative Finance</SelectItem>
                      <SelectItem value="Development">Development</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="hook">Hook/Selling Point</Label>
                <Input
                  id="hook"
                  placeholder="e.g., Under Market Value, Quick Close, Great Cash Flow"
                  value={formData.hook}
                  onChange={(e) => updateFormData('hook', e.target.value)}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="premarket" 
                  checked={formData.isPremarket}
                  onCheckedChange={(checked) => updateFormData('isPremarket', checked)}
                />
                <Label htmlFor="premarket" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  PREMARKET - Deal without specific address (City + State required)
                </Label>
              </div>

              <Button onClick={generateTitles} variant="outline" className="w-full">
                Generate Title Options
              </Button>

              {formData.generatedTitles.length > 0 && (
                <div>
                  <Label>Select Your Title</Label>
                  <RadioGroup value={formData.selectedTitle} onValueChange={(value) => updateFormData('selectedTitle', value)}>
                    {formData.generatedTitles.map((title, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <RadioGroupItem value={title} id={`title-${index}`} />
                        <Label htmlFor={`title-${index}`} className="text-sm">{title}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Basic Property Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="h-5 w-5" />
                Basic Property Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!formData.isPremarket && (
                <div>
                  <Label htmlFor="address">Full Address *</Label>
                  <Input
                    id="address"
                    placeholder="14832 Atlantic Ave, Hudson, FL 34667"
                    value={formData.address}
                    onChange={(e) => updateFormData('address', e.target.value)}
                  />
                </div>
              )}

              <div>
                <Label htmlFor="askingPrice">Asking Price * (Numbers only)</Label>
                <Input
                  id="askingPrice"
                  placeholder="250000"
                  value={formData.askingPrice}
                  onChange={handleAskingPriceChange}
                />
              </div>

              <div>
                <Label>Financing Types Accepted *</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                  {['Cash', 'Conventional', 'FHA', 'VA', 'As-Is'].map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox 
                        id={type}
                        checked={formData.financingTypes.includes(type)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            updateFormData('financingTypes', [...formData.financingTypes, type]);
                          } else {
                            updateFormData('financingTypes', formData.financingTypes.filter(t => t !== type));
                          }
                        }}
                      />
                      <Label htmlFor={type}>{type}</Label>
                    </div>
                  ))}
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="financingOther"
                      checked={formData.financingTypes.includes('Other')}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          updateFormData('financingTypes', [...formData.financingTypes, 'Other']);
                        } else {
                          updateFormData('financingTypes', formData.financingTypes.filter(t => t !== 'Other'));
                          updateFormData('financingOther', '');
                        }
                      }}
                    />
                    <Label htmlFor="financingOther">Other</Label>
                  </div>
                </div>
                {formData.financingTypes.includes('Other') && (
                  <Input
                    className="mt-2"
                    placeholder="Specify other financing type"
                    value={formData.financingOther}
                    onChange={(e) => updateFormData('financingOther', e.target.value)}
                  />
                )}
              </div>

              <div>
                <Label>Closing Date/Deadline *</Label>
                <div className="space-y-2">
                  <RadioGroup 
                    value={formData.closingDateType} 
                    onValueChange={(value) => updateFormData('closingDateType', value as 'exact' | 'onBefore')}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="exact" id="exact" />
                      <Label htmlFor="exact">Exact Date</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="onBefore" id="onBefore" />
                      <Label htmlFor="onBefore">On/Before Date</Label>
                    </div>
                  </RadioGroup>
                  <Input
                    type="date"
                    value={formData.closingDate}
                    onChange={(e) => updateFormData('closingDate', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Photo Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Property Photos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="photoLink">PHOTO LINK *</Label>
                <Input
                  id="photoLink"
                  placeholder="https://photos.zillowstatic.com/..."
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
                  onChange={(e) => updateFormData('frontPhoto', e.target.files?.[0] || null)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Property Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Property Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="bedrooms">Bedrooms *</Label>
                  <Input
                    id="bedrooms"
                    placeholder="3"
                    value={formData.bedrooms}
                    onChange={(e) => updateFormData('bedrooms', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="bathrooms">Bathrooms *</Label>
                  <Input
                    id="bathrooms"
                    placeholder="2"
                    value={formData.bathrooms}
                    onChange={(e) => updateFormData('bathrooms', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="squareFootage">Square Footage *</Label>
                  <Input
                    id="squareFootage"
                    placeholder="1,200"
                    value={formData.squareFootage}
                    onChange={(e) => updateFormData('squareFootage', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="yearBuilt">Year Built *</Label>
                  <Input
                    id="yearBuilt"
                    placeholder="1985"
                    value={formData.yearBuilt}
                    onChange={(e) => updateFormData('yearBuilt', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="zoning">Zoning</Label>
                  <Input
                    id="zoning"
                    placeholder="Residential"
                    value={formData.zoning}
                    onChange={(e) => updateFormData('zoning', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="lotSize">Lot Size</Label>
                  <Input
                    id="lotSize"
                    placeholder="0.25 acres"
                    value={formData.lotSize}
                    onChange={(e) => updateFormData('lotSize', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="foundationType">Foundation Type</Label>
                <Select value={formData.foundationType} onValueChange={(value) => updateFormData('foundationType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select foundation type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Slab">Slab</SelectItem>
                    <SelectItem value="Crawl Space">Crawl Space</SelectItem>
                    <SelectItem value="Basement">Basement</SelectItem>
                    <SelectItem value="Pier & Beam">Pier & Beam</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Utilities</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                  {['City Water', 'City Sewer', 'Septic', 'Well'].map((utility) => (
                    <div key={utility} className="flex items-center space-x-2">
                      <Checkbox 
                        id={utility}
                        checked={formData.utilities.includes(utility)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            updateFormData('utilities', [...formData.utilities, utility]);
                          } else {
                            updateFormData('utilities', formData.utilities.filter(u => u !== utility));
                          }
                        }}
                      />
                      <Label htmlFor={utility}>{utility}</Label>
                    </div>
                  ))}
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="utilitiesOther"
                      checked={formData.utilities.includes('Other')}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          updateFormData('utilities', [...formData.utilities, 'Other']);
                        } else {
                          updateFormData('utilities', formData.utilities.filter(u => u !== 'Other'));
                          updateFormData('utilitiesOther', '');
                        }
                      }}
                    />
                    <Label htmlFor="utilitiesOther">Other</Label>
                  </div>
                </div>
                {formData.utilities.includes('Other') && (
                  <Input
                    className="mt-2"
                    placeholder="Specify other utilities"
                    value={formData.utilitiesOther}
                    onChange={(e) => updateFormData('utilitiesOther', e.target.value)}
                  />
                )}
              </div>

              <div>
                <Label>Garage</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div>
                    <Label htmlFor="garageSpaces">Number of Spaces</Label>
                    <Input
                      id="garageSpaces"
                      placeholder="2"
                      value={formData.garageSpaces}
                      onChange={(e) => updateFormData('garageSpaces', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="garageType">Type</Label>
                    <Select value={formData.garageType} onValueChange={(value) => updateFormData('garageType', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="attached">Attached</SelectItem>
                        <SelectItem value="detached">Detached</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                {formData.garageSpaces && formData.garageType && (
                  <p className="text-sm text-gray-600 mt-2">
                    Display: "{formData.garageType.charAt(0).toUpperCase() + formData.garageType.slice(1)} {formData.garageSpaces}-car garage"
                  </p>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="pool" 
                  checked={formData.pool}
                  onCheckedChange={(checked) => updateFormData('pool', checked)}
                />
                <Label htmlFor="pool">Pool</Label>
              </div>
            </CardContent>
          </Card>

          {/* Big Ticket Systems */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="h-5 w-5" />
                Big Ticket Systems (Required)
              </CardTitle>
              <CardDescription>Information about major home systems</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {formData.bigTicketItems.map((item, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <Label htmlFor={`item-type-${index}`}>System Type *</Label>
                      {index < 3 ? (
                        <Input
                          id={`item-type-${index}`}
                          value={item.type}
                          disabled
                          className="bg-gray-100"
                        />
                      ) : (
                        <Input
                          id={`item-type-${index}`}
                          placeholder="e.g., Furnace, Solar System"
                          value={item.type}
                          onChange={(e) => updateBigTicketItem(index, 'type', e.target.value)}
                        />
                      )}
                    </div>
                    {index >= 3 && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => removeBigTicketItem(index)}
                        className="ml-2"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div>
                    <Label>Age *</Label>
                    <RadioGroup 
                      value={item.ageType} 
                      onValueChange={(value) => updateBigTicketItem(index, 'ageType', value)}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="range" id={`range-${index}`} />
                        <Label htmlFor={`range-${index}`}>Age Range</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="specific" id={`specific-${index}`} />
                        <Label htmlFor={`specific-${index}`}>Specific Year</Label>
                      </div>
                    </RadioGroup>

                    {item.ageType === 'range' ? (
                      <Select value={item.age} onValueChange={(value) => updateBigTicketItem(index, 'age', value)}>
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Select age range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0-5 years">0-5 years</SelectItem>
                          <SelectItem value="6-10 years">6-10 years</SelectItem>
                          <SelectItem value="11-15 years">11-15 years</SelectItem>
                          <SelectItem value="16-20 years">16-20 years</SelectItem>
                          <SelectItem value="20+ years">20+ years</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="mt-2 space-y-1">
                        <Input
                          placeholder="e.g., 2015"
                          value={item.specificYear}
                          onChange={(e) => updateBigTicketItem(index, 'specificYear', e.target.value)}
                          inputMode="numeric"
                          pattern="\d{4}"
                          maxLength={4}
                        />
                        <p className="text-sm text-muted-foreground">Enter a 4-digit year</p>
                      </div>
                    )}
                  </div>

                  <div>
                    <Label htmlFor={`condition-${index}`}>Condition *</Label>
                    <Select value={item.condition} onValueChange={(value) => updateBigTicketItem(index, 'condition', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="New">New</SelectItem>
                        <SelectItem value="Good">Good</SelectItem>
                        <SelectItem value="Fair">Fair</SelectItem>
                        <SelectItem value="Poor">Poor</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor={`lastServiced-${index}`}>Last Serviced (Optional)</Label>
                    <Input
                      id={`lastServiced-${index}`}
                      placeholder="e.g., Spring 2023"
                      value={item.lastServiced}
                      onChange={(e) => updateBigTicketItem(index, 'lastServiced', e.target.value)}
                    />
                  </div>
                </div>
              ))}

              <Button onClick={addBigTicketItem} variant="outline" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Big Ticket Item
              </Button>
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
            <CardContent>
              <div>
                <Label htmlFor="occupancy">Occupancy Status *</Label>
                <Select value={formData.occupancy} onValueChange={(value) => updateFormData('occupancy', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select occupancy status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Owner Occupied">Owner Occupied</SelectItem>
                    <SelectItem value="Vacant">Vacant</SelectItem>
                    <SelectItem value="Tenant Occupied">Tenant Occupied</SelectItem>
                  </SelectContent>
                </Select>
                {formData.occupancy === "Owner Occupied" && (
                  <p className="text-sm text-gray-600 mt-2">
                    Display: "Owner Occupied (to be delivered vacant)"
                  </p>
                )}
              </div>
              
              <div className="mt-4">
                <Label htmlFor="occupancyOnDelivery">Occupancy on Delivery *</Label>
                <Select value={formData.occupancyOnDelivery} onValueChange={(value) => updateFormData('occupancyOnDelivery', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select occupancy on delivery" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Owner Occupied">Owner Occupied</SelectItem>
                    <SelectItem value="Vacant">Vacant</SelectItem>
                    <SelectItem value="Tenant Occupied">Tenant Occupied</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Financial Snapshot */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Financial Snapshot
              </CardTitle>
              <CardDescription>Optional financial breakdown for investors</CardDescription>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="arv">ARV (After Repair Value)</Label>
                    <Input
                      id="arv"
                      placeholder="$325,000"
                      value={formData.arv}
                      onChange={(e) => updateFormData('arv', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="rehabEstimate">Rehab Estimate</Label>
                    <Input
                      id="rehabEstimate"
                      placeholder="$45,000"
                      value={formData.rehabEstimate}
                      onChange={(e) => updateFormData('rehabEstimate', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="allIn">All-In Cost</Label>
                    <Input
                      id="allIn"
                      placeholder="$295,000"
                      value={formData.allIn}
                      onChange={(e) => updateFormData('allIn', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="grossProfit">Gross Profit</Label>
                    <Input
                      id="grossProfit"
                      placeholder="$30,000"
                      value={formData.grossProfit}
                      onChange={(e) => updateFormData('grossProfit', e.target.value)}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="exitStrategy">Exit Strategy</Label>
                    <Select value={formData.exitStrategy} onValueChange={(value) => updateFormData('exitStrategy', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select exit strategy" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Flip">Flip</SelectItem>
                        <SelectItem value="Buy & Hold">Buy & Hold</SelectItem>
                        <SelectItem value="BRRRR">BRRRR</SelectItem>
                        <SelectItem value="Wholesale">Wholesale</SelectItem>
                        <SelectItem value="Live-in Flip">Live-in Flip</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Comps Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                🔍 Comparable Sales Breakdown
              </CardTitle>
              <CardDescription>At least 2 comparable properties are required</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {formData.comps.map((comp, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Comp #{index + 1}</h4>
                    {formData.comps.length > 2 && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => removeComp(index)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Address *</Label>
                      <Input
                        placeholder="14832 Atlantic Ave, Hudson, FL 34667"
                        value={comp.address}
                        onChange={(e) => updateComp(index, 'address', e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <Label>Zillow/MLS Link</Label>
                      <Input
                        placeholder="https://www.zillow.com/..."
                        value={comp.zillowLink}
                        onChange={(e) => updateComp(index, 'zillowLink', e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <Label>Bedrooms *</Label>
                      <Input
                        placeholder="3"
                        value={comp.bedrooms}
                        onChange={(e) => updateComp(index, 'bedrooms', e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <Label>Bathrooms *</Label>
                      <Input
                        placeholder="2"
                        value={comp.bathrooms}
                        onChange={(e) => updateComp(index, 'bathrooms', e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <Label>Square Footage *</Label>
                      <Input
                        placeholder="1,200"
                        value={comp.squareFootage}
                        onChange={(e) => updateComp(index, 'squareFootage', e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <Label>Lot Size (Optional)</Label>
                      <Input
                        placeholder="0.25 acres or 10,890 sq ft"
                        value={comp.lotSize}
                        onChange={(e) => updateComp(index, 'lotSize', e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <Label>Comp Type *</Label>
                      <Select value={comp.compType} onValueChange={(value) => updateComp(index, 'compType', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select comp type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Flip Comps">Flip Comps</SelectItem>
                          <SelectItem value="Cash Comps">Cash Comps</SelectItem>
                          <SelectItem value="Rental Comps">Rental Comps</SelectItem>
                          <SelectItem value="CMV">CMV (Current Market Value)</SelectItem>
                          <SelectItem value="New Construction">New Construction</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Status</Label>
                      <Select value={comp.status} onValueChange={(value) => updateComp(index, 'status', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Active">Active</SelectItem>
                          <SelectItem value="Sold">Sold</SelectItem>
                          <SelectItem value="Pending">Pending</SelectItem>
                          <SelectItem value="Contingent">Contingent</SelectItem>
                          <SelectItem value="Listed for Rent">Listed for Rent</SelectItem>
                          <SelectItem value="Off-Market">Off-Market</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label>Condition *</Label>
                      <Select value={comp.conditionLabel} onValueChange={(value) => updateComp(index, 'conditionLabel', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select condition" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Flip Condition">Flip Condition</SelectItem>
                          <SelectItem value="Retail Condition">Retail Condition</SelectItem>
                          <SelectItem value="Move-in Ready">Move-in Ready</SelectItem>
                          <SelectItem value="Needs Work">Needs Work</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label>Asset Type *</Label>
                      <Select value={comp.assetType} onValueChange={(value) => updateComp(index, 'assetType', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select asset type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Residential">Residential</SelectItem>
                          <SelectItem value="Commercial">Commercial</SelectItem>
                          <SelectItem value="Land">Land</SelectItem>
                          <SelectItem value="Multi-Family">Multi-Family</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      {comp.assetType === 'Other' && (
                        <div className="mt-2">
                          <Input
                            placeholder="Specify asset type"
                            value={comp.assetTypeOther}
                            onChange={(e) => updateComp(index, 'assetTypeOther', e.target.value)}
                          />
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <Label>Sold/Listed/Pending Price (Optional)</Label>
                      <Input
                        placeholder="$250,000"
                        value={comp.soldListedPrice}
                        onChange={(e) => updateComp(index, 'soldListedPrice', e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <Label>Sold/Listed Date (Optional)</Label>
                      <Input
                        type="date"
                        value={comp.soldListedDate}
                        onChange={(e) => updateComp(index, 'soldListedDate', e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <Label>Pending Date (Optional)</Label>
                      <Input
                        type="date"
                        value={comp.pendingDate}
                        onChange={(e) => updateComp(index, 'pendingDate', e.target.value)}
                      />
                    </div>

                    <div>
                      <Label>Listed Rent Price (Optional)</Label>
                      <Input
                        placeholder="$1,350/mo"
                        value={comp.rentPrice}
                        onChange={(e) => updateComp(index, 'rentPrice', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))}
              
              <Button onClick={addComp} variant="outline" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Another Comp
              </Button>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contactName">Contact Name *</Label>
                  <Input
                    id="contactName"
                    placeholder="John Smith"
                    value={formData.contactName}
                    onChange={(e) => updateFormData('contactName', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="contactPhone">Contact Phone *</Label>
                  <Input
                    id="contactPhone"
                    placeholder="(555) 123-4567"
                    value={formData.contactPhone}
                    onChange={(e) => updateFormData('contactPhone', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.contactEmail}
                    onChange={(e) => updateFormData('contactEmail', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="officeNumber">Office Number</Label>
                  <Input
                    id="officeNumber"
                    placeholder="(555) 987-6543"
                    value={formData.officeNumber}
                    onChange={(e) => updateFormData('officeNumber', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    placeholder="www.yourwebsite.com"
                    value={formData.website}
                    onChange={(e) => updateFormData('website', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label>Business Hours</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                  <div>
                    <Label htmlFor="businessHoursStart">Start Time</Label>
                    <Input
                      id="businessHoursStart"
                      type="time"
                      value={formData.businessHoursStart}
                      onChange={(e) => updateFormData('businessHoursStart', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="businessHoursEnd">End Time</Label>
                    <Input
                      id="businessHoursEnd"
                      type="time"
                      value={formData.businessHoursEnd}
                      onChange={(e) => updateFormData('businessHoursEnd', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="businessHoursTimezone">Timezone</Label>
                    <Select value={formData.businessHoursTimezone} onValueChange={(value) => updateFormData('businessHoursTimezone', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select timezone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="EST">EST</SelectItem>
                        <SelectItem value="CST">CST</SelectItem>
                        <SelectItem value="MST">MST</SelectItem>
                        <SelectItem value="PST">PST</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="companyLogo">Company Logo (Optional)</Label>
                <Input
                  id="companyLogo"
                  type="file"
                  accept="image/*"
                  onChange={(e) => updateFormData('companyLogo', e.target.files?.[0] || null)}
                />
              </div>

              <div>
                <Label htmlFor="contactImage">Personal Headshot (Optional)</Label>
                <Input
                  id="contactImage"
                  type="file"
                  accept="image/*"
                  onChange={(e) => updateFormData('contactImage', e.target.files?.[0] || null)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Legal Disclosures */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Legal Disclosures
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="emdAmount">EMD Amount (Optional)</Label>
                  <Input
                    id="emdAmount"
                    placeholder="$5,000"
                    value={formData.emdAmount}
                    onChange={(e) => updateFormData('emdAmount', e.target.value)}
                  />
                </div>
                {formData.emdAmount && (
                  <div>
                    <Label htmlFor="emdDueDate">EMD Due Date *</Label>
                    <Input
                      id="emdDueDate"
                      placeholder="Within 24 hours of signed purchase offer"
                      value={formData.emdDueDate}
                      onChange={(e) => updateFormData('emdDueDate', e.target.value)}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Typically within 24 hours of signed purchase offer
                    </p>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="postPossession" 
                  checked={formData.postPossession}
                  onCheckedChange={(checked) => updateFormData('postPossession', checked)}
                />
                <Label htmlFor="postPossession">Post-Possession Available</Label>
              </div>

              <div>
                <Label htmlFor="additionalDisclosures">Additional Notes / Disclosures</Label>
                <Textarea
                  id="additionalDisclosures"
                  placeholder="Any additional information, disclosures, or special conditions..."
                  value={formData.additionalDisclosures}
                  onChange={(e) => updateFormData('additionalDisclosures', e.target.value)}
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Generate Button */}
          <div className="flex justify-center">
            <Button 
              onClick={handleGeneratePDF} 
              disabled={isGenerating}
              size="lg"
              className="px-8 py-3"
            >
              {isGenerating ? (
                <>
                  <FileText className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <FileText className="mr-2 h-4 w-4" />
                  Generate Property Flyer
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      <SuccessModal 
        open={showSuccessModal}
        onOpenChange={setShowSuccessModal}
        shareUrl={shareUrl}
        onCopyUrl={copyShareUrl}
        onViewProperty={() => window.open(shareUrl, '_blank')}
      />
    </div>
  );
};

export default Index;