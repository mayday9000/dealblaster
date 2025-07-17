import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Download, FileText, DollarSign, Home, MapPin, Phone, Mail, Building, Calculator } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import { generatePDF } from '@/utils/pdfGenerator';

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
      
      await generatePDF({
        ...formData,
        title,
        subtitle
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

          {/* Financial Information */}
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

          {/* Contact Information */}
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

          {/* EMD and Closing */}
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

          {/* Exit Strategy */}
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
