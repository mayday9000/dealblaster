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
import { CalendarIcon, Download, FileText, DollarSign, Home, MapPin, Phone, Mail, Building, Calculator, Plus, Minus, Wrench, Users, Lock } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import { generatePDF } from '@/utils/pdfGenerator';
import { usePdfSections } from '@/hooks/usePdfSections';

interface FormData {
  // Property basics
  address: string;
  beds: number;
  baths: number;
  sqft: number;
  yearBuilt: number;
  lotSize: number;
  zoning: string;
  
  // Financial
  purchasePrice: number;
  rehabEstimate: number;
  arv: number;
  sellingCosts: number;
  netProfit: number;
  
  // Property details
  roofAge: string;
  roofCondition: string;
  roofNotes: string;
  hvacAge: string;
  hvacCondition: string;
  hvacNotes: string;
  waterHeaterAge: string;
  waterHeaterCondition: string;
  waterHeaterNotes: string;
  sidingType: string;
  sidingCondition: string;
  sidingNotes: string;
  additionalNotes: string;
  
  // Comps
  pendingComps: string[];
  soldComps: string[];
  rentalComps: string[];
  newConstructionComps: string[];
  asIsComps: string[];
  
  // Occupancy
  occupancy: string;
  leaseTerms: string;
  
  // Access
  access: string;
  lockboxCode: string;
  
  // Contact
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  businessHours: string;
  
  // EMD
  emdAmount: number;
  emdDueDate: string;
  memoFiled: boolean;
  
  // Other
  photoLink: string;
  exitStrategy: string;
  rentalBackup: boolean;
  rentalBackupDetails: string;
  closingDate: Date | undefined;
}

const Index = () => {
  const { refs, orderKeys } = usePdfSections();
  const [formData, setFormData] = useState<FormData>({
    address: '',
    beds: 0,
    baths: 0,
    sqft: 0,
    yearBuilt: 0,
    lotSize: 0,
    zoning: '',
    purchasePrice: 0,
    rehabEstimate: 0,
    arv: 0,
    sellingCosts: 8,
    netProfit: 0,
    roofAge: '',
    roofCondition: '',
    roofNotes: '',
    hvacAge: '',
    hvacCondition: '',
    hvacNotes: '',
    waterHeaterAge: '',
    waterHeaterCondition: '',
    waterHeaterNotes: '',
    sidingType: '',
    sidingCondition: '',
    sidingNotes: '',
    additionalNotes: '',
    pendingComps: [''],
    soldComps: [''],
    rentalComps: [''],
    newConstructionComps: [''],
    asIsComps: [''],
    occupancy: '',
    leaseTerms: '',
    access: '',
    lockboxCode: '',
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    businessHours: '',
    emdAmount: 0,
    emdDueDate: '',
    memoFiled: false,
    photoLink: '',
    exitStrategy: '',
    rentalBackup: false,
    rentalBackupDetails: '',
    closingDate: undefined,
  });

  const [isGenerating, setIsGenerating] = useState(false);

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateCompArray = (type: 'pendingComps' | 'soldComps' | 'rentalComps' | 'newConstructionComps' | 'asIsComps', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [type]: prev[type].map((item, i) => i === index ? value : item)
    }));
  };

  const addCompField = (type: 'pendingComps' | 'soldComps' | 'rentalComps' | 'newConstructionComps' | 'asIsComps') => {
    setFormData(prev => ({
      ...prev,
      [type]: [...prev[type], '']
    }));
  };

  const removeCompField = (type: 'pendingComps' | 'soldComps' | 'rentalComps' | 'newConstructionComps' | 'asIsComps', index: number) => {
    setFormData(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }));
  };

  const generateTitle = () => {
    const city = formData.address.split(',')[1]?.trim() || 'Prime Location';
    const grossProfit = formData.arv - formData.purchasePrice - formData.rehabEstimate;
    return `${city} - $${Math.round(grossProfit / 1000)}k Gross Profit Flip Opportunity!`;
  };

  const generateSubtitle = () => {
    return `Rare Fix/Flip Opportunity Inside The Beltline - Prime ${formData.address.split(',')[1]?.trim() || 'Location'} Neighborhood`;
  };

  const handleGeneratePDF = async () => {
    if (!formData.address || !formData.purchasePrice || !formData.arv) {
      toast({
        title: "Missing Required Fields",
        description: "Please fill in at least the property address, purchase price, and ARV.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      const title = generateTitle();
      const subtitle = generateSubtitle();
      const sectionElements = orderKeys
        .map(key => ({ key, el: refs[key].current }))
        .filter(s => s.el) as { key: any; el: HTMLElement }[];

      await generatePDF({
        ...formData,
        title,
        subtitle,
        sections: sectionElements,
      });
      
      toast({
        title: "PDF Generated Successfully!",
        description: "Your fix & flip flyer has been downloaded.",
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-2">
            <Building className="h-8 w-8 text-blue-600" />
            Fix & Flip Deal Flyer Generator
          </h1>
          <p className="text-lg text-gray-600">
            Create professional investment property flyers in minutes
          </p>
        </div>

        <div className="grid gap-6">
          {/* Property Information */}
          <div ref={refs.property} data-pdf-section="property">
            <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="h-5 w-5" />
                Property Information
              </CardTitle>
              <CardDescription>Basic property details and location</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="address">Property Address *</Label>
                <Input
                  id="address"
                  placeholder="1309 Plymouth Ct, Raleigh, NC 27610"
                  value={formData.address}
                  onChange={(e) => updateFormData('address', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="beds">Bedrooms</Label>
                <Input
                  id="beds"
                  type="number"
                  value={formData.beds}
                  onChange={(e) => updateFormData('beds', parseInt(e.target.value) || 0)}
                />
              </div>
              
              <div>
                <Label htmlFor="baths">Bathrooms</Label>
                <Input
                  id="baths"
                  type="number"
                  step="0.5"
                  value={formData.baths}
                  onChange={(e) => updateFormData('baths', parseFloat(e.target.value) || 0)}
                />
              </div>
              
              <div>
                <Label htmlFor="sqft">Square Footage</Label>
                <Input
                  id="sqft"
                  type="number"
                  value={formData.sqft}
                  onChange={(e) => updateFormData('sqft', parseInt(e.target.value) || 0)}
                />
              </div>
              
              <div>
                <Label htmlFor="yearBuilt">Year Built</Label>
                <Input
                  id="yearBuilt"
                  type="number"
                  value={formData.yearBuilt}
                  onChange={(e) => updateFormData('yearBuilt', parseInt(e.target.value) || 0)}
                />
              </div>
              
              <div>
                <Label htmlFor="lotSize">Lot Size (acres)</Label>
                <Input
                  id="lotSize"
                  type="number"
                  step="0.01"
                  value={formData.lotSize}
                  onChange={(e) => updateFormData('lotSize', parseFloat(e.target.value) || 0)}
                />
              </div>
              
              <div>
                <Label htmlFor="zoning">Zoning</Label>
                <Input
                  id="zoning"
                  placeholder="R-6"
                  value={formData.zoning}
                  onChange={(e) => updateFormData('zoning', e.target.value)}
                />
              </div>
              
              <div className="md:col-span-2">
                <Label htmlFor="photoLink">Property Photo Link</Label>
                <Input
                  id="photoLink"
                  placeholder="https://example.com/photo.jpg"
                  value={formData.photoLink}
                  onChange={(e) => updateFormData('photoLink', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
          </div>

          {/* Financial Information */}
          <div ref={refs.financial} data-pdf-section="financial">
            <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Financial Breakdown
              </CardTitle>
              <CardDescription>Investment numbers and profit calculation</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="purchasePrice">Purchase Price *</Label>
                <Input
                  id="purchasePrice"
                  type="number"
                  value={formData.purchasePrice}
                  onChange={(e) => updateFormData('purchasePrice', parseInt(e.target.value) || 0)}
                />
              </div>
              
              <div>
                <Label htmlFor="rehabEstimate">Rehab Estimate</Label>
                <Input
                  id="rehabEstimate"
                  type="number"
                  value={formData.rehabEstimate}
                  onChange={(e) => updateFormData('rehabEstimate', parseInt(e.target.value) || 0)}
                />
              </div>
              
              <div>
                <Label htmlFor="arv">After Repair Value (ARV) *</Label>
                <Input
                  id="arv"
                  type="number"
                  value={formData.arv}
                  onChange={(e) => updateFormData('arv', parseInt(e.target.value) || 0)}
                />
              </div>
              
              <div>
                <Label htmlFor="sellingCosts">Selling Costs (%)</Label>
                <Input
                  id="sellingCosts"
                  type="number"
                  value={formData.sellingCosts}
                  onChange={(e) => updateFormData('sellingCosts', parseInt(e.target.value) || 0)}
                />
              </div>
              
              <div className="md:col-span-2">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Calculator className="h-5 w-5 text-green-600" />
                    <span className="font-semibold text-green-800">Calculated Gross Profit</span>
                  </div>
                  <div className="text-2xl font-bold text-green-600">
                    ${(formData.arv - formData.purchasePrice - formData.rehabEstimate).toLocaleString()}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          </div>

          {/* Contact Information */}
          <div ref={refs.contact} data-pdf-section="contact">
            <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contactName">Name / Company</Label>
                <Input
                  id="contactName"
                  value={formData.contactName}
                  onChange={(e) => updateFormData('contactName', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="contactPhone">Phone</Label>
                <Input
                  id="contactPhone"
                  value={formData.contactPhone}
                  onChange={(e) => updateFormData('contactPhone', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="contactEmail">Email</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => updateFormData('contactEmail', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="businessHours">Business Hours</Label>
                <Input
                  id="businessHours"
                  placeholder="Mon-Fri, 9AM-5PM"
                  value={formData.businessHours}
                  onChange={(e) => updateFormData('businessHours', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
          </div>

          {/* EMD and Closing */}
          <div ref={refs.emdClosing} data-pdf-section="emdClosing">
            <Card>
            <CardHeader>
              <CardTitle>EMD & Closing Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="emdAmount">EMD Amount</Label>
                <Input
                  id="emdAmount"
                  type="number"
                  value={formData.emdAmount}
                  onChange={(e) => updateFormData('emdAmount', parseInt(e.target.value) || 0)}
                />
              </div>
              
              <div>
                <Label htmlFor="closingDate">Closing Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.closingDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.closingDate ? format(formData.closingDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.closingDate}
                      onSelect={(date) => updateFormData('closingDate', date)}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="md:col-span-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="memoFiled"
                    checked={formData.memoFiled}
                    onCheckedChange={(checked) => updateFormData('memoFiled', checked)}
                  />
                  <Label htmlFor="memoFiled">Memorandum of Contract Filed</Label>
                </div>
              </div>
            </CardContent>
          </Card>
          </div>

          {/* Exit Strategy */}
          <div ref={refs.exitStrategy} data-pdf-section="exitStrategy">
            <Card>
            <CardHeader>
              <CardTitle>Exit Strategy & Notes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="exitStrategy">Exit Strategy Notes</Label>
                <Textarea
                  id="exitStrategy"
                  placeholder="Full gut renovation needed. Roof, flooring, and siding need replacement. Foundation in good condition."
                  value={formData.exitStrategy}
                  onChange={(e) => updateFormData('exitStrategy', e.target.value)}
                  rows={4}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="rentalBackup"
                  checked={formData.rentalBackup}
                  onCheckedChange={(checked) => updateFormData('rentalBackup', checked)}
                />
                <Label htmlFor="rentalBackup">Rental Backup Plan Available</Label>
              </div>
              
              {formData.rentalBackup && (
                <div>
                  <Label htmlFor="rentalBackupDetails">Rental Backup Details</Label>
                  <Textarea
                    id="rentalBackupDetails"
                    placeholder="Nearby 1-bed rents for $1,000/month. Solid rental backup option if resale timing shifts."
                    value={formData.rentalBackupDetails}
                    onChange={(e) => updateFormData('rentalBackupDetails', e.target.value)}
                    rows={3}
                  />
                </div>
              )}
            </CardContent>
          </Card>
          </div>

          {/* Property Details */}
          <div ref={refs.propertyDetails} data-pdf-section="propertyDetails">
            <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="h-5 w-5" />
                Property Details
              </CardTitle>
              <CardDescription>Detailed condition information for each major system</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Roof */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Roof</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  <div className="text-sm text-gray-600">Age:</div>
                  <div></div>
                  <div className="text-sm text-gray-600">Condition:</div>
                  <div></div>
                  <RadioGroup
                    value={formData.roofAge}
                    onValueChange={(value) => updateFormData('roofAge', value)}
                    className="flex flex-wrap gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="<5yrs" id="roof-5" />
                      <Label htmlFor="roof-5" className="text-sm">&lt;5 yrs</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="<10yrs" id="roof-10" />
                      <Label htmlFor="roof-10" className="text-sm">&lt;10 yrs</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="<15yrs" id="roof-15" />
                      <Label htmlFor="roof-15" className="text-sm">&lt;15 yrs</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="<20yrs" id="roof-20" />
                      <Label htmlFor="roof-20" className="text-sm">&lt;20 yrs</Label>
                    </div>
                  </RadioGroup>
                  <RadioGroup
                    value={formData.roofCondition}
                    onValueChange={(value) => updateFormData('roofCondition', value)}
                    className="flex flex-wrap gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="needs-replacement" id="roof-replace" />
                      <Label htmlFor="roof-replace" className="text-sm">Needs Replacement</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="working" id="roof-working" />
                      <Label htmlFor="roof-working" className="text-sm">Working Condition</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div>
                  <Label htmlFor="roofNotes">Notes</Label>
                  <Textarea
                    id="roofNotes"
                    placeholder="Additional roof details..."
                    value={formData.roofNotes}
                    onChange={(e) => updateFormData('roofNotes', e.target.value)}
                    rows={2}
                  />
                </div>
              </div>

              {/* HVAC */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">HVAC</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  <div className="text-sm text-gray-600">Age:</div>
                  <div></div>
                  <div className="text-sm text-gray-600">Condition:</div>
                  <div></div>
                  <RadioGroup
                    value={formData.hvacAge}
                    onValueChange={(value) => updateFormData('hvacAge', value)}
                    className="flex flex-wrap gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="<5yrs" id="hvac-5" />
                      <Label htmlFor="hvac-5" className="text-sm">&lt;5 yrs</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="<10yrs" id="hvac-10" />
                      <Label htmlFor="hvac-10" className="text-sm">&lt;10 yrs</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="<15yrs" id="hvac-15" />
                      <Label htmlFor="hvac-15" className="text-sm">&lt;15 yrs</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="<20yrs" id="hvac-20" />
                      <Label htmlFor="hvac-20" className="text-sm">&lt;20 yrs</Label>
                    </div>
                  </RadioGroup>
                  <RadioGroup
                    value={formData.hvacCondition}
                    onValueChange={(value) => updateFormData('hvacCondition', value)}
                    className="flex flex-wrap gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="needs-replacement" id="hvac-replace" />
                      <Label htmlFor="hvac-replace" className="text-sm">Needs Replacement</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="working" id="hvac-working" />
                      <Label htmlFor="hvac-working" className="text-sm">Working Condition</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div>
                  <Label htmlFor="hvacNotes">Notes</Label>
                  <Textarea
                    id="hvacNotes"
                    placeholder="Additional HVAC details..."
                    value={formData.hvacNotes}
                    onChange={(e) => updateFormData('hvacNotes', e.target.value)}
                    rows={2}
                  />
                </div>
              </div>

              {/* Hot Water Heater */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Hot Water Heater</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  <div className="text-sm text-gray-600">Age:</div>
                  <div></div>
                  <div className="text-sm text-gray-600">Condition:</div>
                  <div></div>
                  <RadioGroup
                    value={formData.waterHeaterAge}
                    onValueChange={(value) => updateFormData('waterHeaterAge', value)}
                    className="flex flex-wrap gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="<5yrs" id="water-5" />
                      <Label htmlFor="water-5" className="text-sm">&lt;5 yrs</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="<10yrs" id="water-10" />
                      <Label htmlFor="water-10" className="text-sm">&lt;10 yrs</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="<15yrs" id="water-15" />
                      <Label htmlFor="water-15" className="text-sm">&lt;15 yrs</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="<20yrs" id="water-20" />
                      <Label htmlFor="water-20" className="text-sm">&lt;20 yrs</Label>
                    </div>
                  </RadioGroup>
                  <RadioGroup
                    value={formData.waterHeaterCondition}
                    onValueChange={(value) => updateFormData('waterHeaterCondition', value)}
                    className="flex flex-wrap gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="needs-replacement" id="water-replace" />
                      <Label htmlFor="water-replace" className="text-sm">Needs Replacement</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="working" id="water-working" />
                      <Label htmlFor="water-working" className="text-sm">Working Condition</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div>
                  <Label htmlFor="waterHeaterNotes">Notes</Label>
                  <Textarea
                    id="waterHeaterNotes"
                    placeholder="Additional water heater details..."
                    value={formData.waterHeaterNotes}
                    onChange={(e) => updateFormData('waterHeaterNotes', e.target.value)}
                    rows={2}
                  />
                </div>
              </div>

              {/* Siding */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Siding (Optional)</Label>
                <div>
                  <Label htmlFor="sidingType">Type</Label>
                  <Input
                    id="sidingType"
                    placeholder="Vinyl, Wood, Brick, etc."
                    value={formData.sidingType}
                    onChange={(e) => updateFormData('sidingType', e.target.value)}
                  />
                </div>
                <RadioGroup
                  value={formData.sidingCondition}
                  onValueChange={(value) => updateFormData('sidingCondition', value)}
                  className="flex flex-wrap gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="needs-replacement" id="siding-replace" />
                    <Label htmlFor="siding-replace" className="text-sm">Needs Replacement</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="working" id="siding-working" />
                    <Label htmlFor="siding-working" className="text-sm">Working Condition</Label>
                  </div>
                </RadioGroup>
                <div>
                  <Label htmlFor="sidingNotes">Notes</Label>
                  <Textarea
                    id="sidingNotes"
                    placeholder="Additional siding details..."
                    value={formData.sidingNotes}
                    onChange={(e) => updateFormData('sidingNotes', e.target.value)}
                    rows={2}
                  />
                </div>
              </div>

              {/* Additional Notes */}
              <div>
                <Label htmlFor="additionalNotes">Additional Notes (Condition/Details)</Label>
                <Textarea
                  id="additionalNotes"
                  placeholder="Any other important details about the property condition..."
                  value={formData.additionalNotes}
                  onChange={(e) => updateFormData('additionalNotes', e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
          </div>

          {/* Comps Section */}
          <div ref={refs.comps} data-pdf-section="comps">
            <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Comps
              </CardTitle>
              <CardDescription>Comparable property links and details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Pending Flipped Comps */}
              <div>
                <Label className="text-base font-semibold">Pending Flipped Comps (Zillow Link)</Label>
                <div className="space-y-2">
                  {formData.pendingComps.map((comp, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        placeholder="https://zillow.com/..."
                        value={comp}
                        onChange={(e) => updateCompArray('pendingComps', index, e.target.value)}
                      />
                      {formData.pendingComps.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeCompField('pendingComps', index)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addCompField('pendingComps')}
                    className="mt-2"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Pending Comp
                  </Button>
                </div>
              </div>

              {/* Sold Flipped Comps */}
              <div>
                <Label className="text-base font-semibold">Sold Flipped Comps (Zillow Link)</Label>
                <div className="space-y-2">
                  {formData.soldComps.map((comp, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        placeholder="https://zillow.com/..."
                        value={comp}
                        onChange={(e) => updateCompArray('soldComps', index, e.target.value)}
                      />
                      {formData.soldComps.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeCompField('soldComps', index)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addCompField('soldComps')}
                    className="mt-2"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Sold Comp
                  </Button>
                </div>
              </div>

              {/* Rental Comps */}
              <div>
                <Label className="text-base font-semibold">Rental Comps (Optional)</Label>
                <div className="space-y-2">
                  {formData.rentalComps.map((comp, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        placeholder="https://zillow.com/..."
                        value={comp}
                        onChange={(e) => updateCompArray('rentalComps', index, e.target.value)}
                      />
                      {formData.rentalComps.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeCompField('rentalComps', index)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addCompField('rentalComps')}
                    className="mt-2"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Rental Comp
                  </Button>
                </div>
              </div>

              {/* New Construction Comps */}
              <div>
                <Label className="text-base font-semibold">New Construction Comps (Optional)</Label>
                <div className="space-y-2">
                  {formData.newConstructionComps.map((comp, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        placeholder="https://zillow.com/..."
                        value={comp}
                        onChange={(e) => updateCompArray('newConstructionComps', index, e.target.value)}
                      />
                      {formData.newConstructionComps.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeCompField('newConstructionComps', index)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addCompField('newConstructionComps')}
                    className="mt-2"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Construction Comp
                  </Button>
                </div>
              </div>

              {/* Sold As-Is Comps */}
              <div>
                <Label className="text-base font-semibold">Sold As-Is Comps (Optional)</Label>
                <div className="space-y-2">
                  {formData.asIsComps.map((comp, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        placeholder="https://zillow.com/..."
                        value={comp}
                        onChange={(e) => updateCompArray('asIsComps', index, e.target.value)}
                      />
                      {formData.asIsComps.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeCompField('asIsComps', index)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addCompField('asIsComps')}
                    className="mt-2"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add As-Is Comp
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          </div>

          {/* Occupancy */}
          <div ref={refs.occupancy} data-pdf-section="occupancy">
            <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Occupancy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <RadioGroup
                value={formData.occupancy}
                onValueChange={(value) => updateFormData('occupancy', value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="vacant-delivered-vacant" id="vacant-vacant" />
                  <Label htmlFor="vacant-vacant">Vacant (to be delivered vacant)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="owner-occupied-vacant" id="owner-vacant" />
                  <Label htmlFor="owner-vacant">Owner-Occupied (to be delivered vacant)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="owner-occupied-occupied" id="owner-occupied" />
                  <Label htmlFor="owner-occupied">Owner-Occupied (to be delivered owner-occupied)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="tenant-occupied-vacant" id="tenant-vacant" />
                  <Label htmlFor="tenant-vacant">Tenant-Occupied (to be delivered vacant)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="tenant-occupied-occupied" id="tenant-occupied" />
                  <Label htmlFor="tenant-occupied">Tenant-Occupied (to be delivered tenant-occupied)</Label>
                </div>
              </RadioGroup>

              {(formData.occupancy.includes('tenant') || formData.occupancy.includes('owner-occupied-occupied')) && (
                <div>
                  <Label htmlFor="leaseTerms">Lease Type / Terms</Label>
                  <Textarea
                    id="leaseTerms"
                    placeholder="Month-to-month lease, expires 12/31/2024, rent $1,200/month"
                    value={formData.leaseTerms}
                    onChange={(e) => updateFormData('leaseTerms', e.target.value)}
                    rows={2}
                  />
                </div>
              )}
            </CardContent>
          </Card>
          </div>

          {/* Access */}
          <div ref={refs.access} data-pdf-section="access">
            <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Access
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <RadioGroup
                value={formData.access}
                onValueChange={(value) => updateFormData('access', value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="lockbox" id="lockbox" />
                  <Label htmlFor="lockbox">Lockbox (include code)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="door-unlocked" id="door-unlocked" />
                  <Label htmlFor="door-unlocked">Door Unlocked</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="appointment-required" id="appointment" />
                  <Label htmlFor="appointment">Appointment Required (24-hour notice)</Label>
                </div>
              </RadioGroup>

              {formData.access === 'lockbox' && (
                <div>
                  <Label htmlFor="lockboxCode">Lockbox Code</Label>
                  <Input
                    id="lockboxCode"
                    placeholder="1234"
                    value={formData.lockboxCode}
                    onChange={(e) => updateFormData('lockboxCode', e.target.value)}
                  />
                </div>
              )}
            </CardContent>
          </Card>
          </div>

          {/* Generate PDF Button */}
          <Card>
            <CardContent className="pt-6">
              <Button
                onClick={handleGeneratePDF}
                disabled={isGenerating}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-6 text-lg font-semibold"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Generating PDF...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-5 w-5" />
                    Generate Fix & Flip Flyer PDF
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
