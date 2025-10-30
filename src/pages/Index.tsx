import React, { useState, useEffect } from 'react';
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
import { CalendarIcon, Download, FileText, DollarSign, Home, MapPin, Phone, Mail, Building, Calculator, Plus, Minus, Wrench, Users, Lock, Upload, User, Sparkles, ArrowLeft, Clock, Database } from 'lucide-react';
import SuccessModal from '@/components/SuccessModal';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import { generatePDF } from '@/utils/pdfGenerator';
import { supabase } from '@/integrations/supabase/client';
import { slugify } from '@/utils/slugify';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AuthGate } from '@/components/AuthGate';
import { Header } from '@/components/Header';
import { useSession } from '@/hooks/useSession';
import { buildAbsoluteShareUrl } from '@/lib/shareLinks';

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
  apn: string;
  askingPrice: string;
  financingTypes: string[];
  financingOther: string;
  closingDate: string;
  closingDateType: 'exact' | 'onBefore';
  
  // Photo Section
  photoLink: string;
  frontPhoto: File | null;
  
  // Land Option
  isLand: boolean;
  landCondition: string;
  roadFrontage: string;
  roadFrontageUnit: 'ft' | 'miles';
  
  // Property Overview
  bedrooms: string;
  bathrooms: string;
  squareFootage: string;
  yearBuilt: string;
  zoning: string;
  lotSize: string;
  lotSizeUnit: 'acres' | 'sqft';
  foundationType: string;
  utilities: string[];
  utilitiesOther: string;
  
  // Parking (replaces garage)
  parkingSpaces: string;
  parkingType: 'garage' | 'carport' | 'driveway' | '';
  
  // Pool with type
  pool: boolean;
  poolType: 'inground' | 'above-ground' | '';
  
  // Big Ticket Systems - flexible input
  bigTicketItems: Array<{
    type: string;
    inputFormat: 'year' | 'age' | 'age-range'; // Added age-range option
    input: string; // Single input for year or age
    ageRange: string; // New field for age range selection
    isShitbox: boolean;
    noHVAC: boolean; // New field for "No HVAC" option
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
  
  // 1% Rule
  includeOnePercentRule: boolean;
  
  // Comps
  comps: Array<{
    address: string;
    zillowLink: string;
    bedrooms: string;
    bathrooms: string;
    squareFootage: string;
    lotSize: string;
    roadFrontage: string;
    roadFrontageUnit: 'ft' | 'miles';
    compType: string;
    conditionLabel: string;
    assetType: string;
    assetTypeOther: string;
    status: string;
    soldListedPrice: string;
    soldListedPriceType: 'Listed' | 'Sold';
    soldListedDate: string;
    pendingDate: string;
    currentlyListed: string;
    dom: string;
    distanceFromSubject: string;
    comments: string;
  }>;
  
  // Contact Info
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  officeNumber: string;
  includeBusinessHours: boolean;
  businessHours: {
    startTime: string;
    endTime: string;
    timeZone: string;
  };
  contactImage: File | null;
  companyLogo: File | null;
  website: string;
  
  // Legal Disclosures
  emdAmount: string;
  emdDueDate: string;
  postPossession: string;
  additionalDisclosures: string;
  
  // Buy & Hold Snapshot
  includeBuyHoldSnapshot: boolean;
  buyHoldType: 'standard' | 'subject-to';
  buyHoldPurchasePrice: string;
  buyHoldRehabCost: string;
  buyHoldMonthlyRent: string;
  buyHoldMonthlyTaxes: string;
  buyHoldMonthlyInsurance: string;
  buyHoldOtherExpenses: string;
  // Subject-To specific
  buyHoldMortgagePayment: string;
  buyHoldCashToSeller: string;
}

const Index = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const editSlug = searchParams.get('editSlug');
  const { user } = useSession();
  
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
    apn: '',
    askingPrice: '',
    financingTypes: [],
    financingOther: '',
    closingDate: '',
    closingDateType: 'exact',
    
    // Photo Section
    photoLink: '',
    frontPhoto: null,
    
    // Land Option
    isLand: false,
    landCondition: '',
    roadFrontage: '',
    roadFrontageUnit: 'ft',
    
    // Property Overview
    bedrooms: '',
    bathrooms: '',
    squareFootage: '',
    yearBuilt: '',
    zoning: '',
    lotSize: '',
    lotSizeUnit: 'acres',
    foundationType: '',
    utilities: [],
    utilitiesOther: '',
    
    // Parking (replaces garage)
    parkingSpaces: '',
    parkingType: '',
    
    // Pool with type
    pool: false,
    poolType: '',
    
    // Big Ticket Systems - simplified
    bigTicketItems: [
      { type: 'Roof', inputFormat: 'year', input: '', ageRange: '', isShitbox: false, noHVAC: false, lastServiced: '' },
      { type: 'HVAC', inputFormat: 'year', input: '', ageRange: '', isShitbox: false, noHVAC: false, lastServiced: '' },
      { type: 'Water Heater', inputFormat: 'year', input: '', ageRange: '', isShitbox: false, noHVAC: false, lastServiced: '' }
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
    
    // 1% Rule
    includeOnePercentRule: false,
    
    // Comps
    comps: [
      {
        address: '',
        zillowLink: '',
        bedrooms: '',
        bathrooms: '',
        squareFootage: '',
        lotSize: '',
        roadFrontage: '',
        roadFrontageUnit: 'ft',
        compType: '',
        conditionLabel: '',
        assetType: '',
        assetTypeOther: '',
        status: '',
        soldListedPrice: '',
        soldListedPriceType: 'Listed',
        soldListedDate: '',
        pendingDate: '',
        currentlyListed: '',
        dom: '',
        distanceFromSubject: '',
        comments: '',
      },
      {
        address: '',
        zillowLink: '',
        bedrooms: '',
        bathrooms: '',
        squareFootage: '',
        lotSize: '',
        roadFrontage: '',
        roadFrontageUnit: 'ft',
        compType: '',
        conditionLabel: '',
        assetType: '',
        assetTypeOther: '',
        status: '',
        soldListedPrice: '',
        soldListedPriceType: 'Listed',
        soldListedDate: '',
        pendingDate: '',
        currentlyListed: '',
        dom: '',
        distanceFromSubject: '',
        comments: '',
      }
    ],
    
    // Contact Info
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    officeNumber: '',
    includeBusinessHours: false,
    businessHours: {
      startTime: '',
      endTime: '',
      timeZone: 'EST'
    },
    contactImage: null,
    companyLogo: null,
    website: '',
    
    // Legal Disclosures
    emdAmount: '',
    emdDueDate: '',
    postPossession: '',
    additionalDisclosures: '',
    
    // Buy & Hold Snapshot
    includeBuyHoldSnapshot: false,
    buyHoldType: 'standard',
    buyHoldPurchasePrice: '',
    buyHoldRehabCost: '',
    buyHoldMonthlyRent: '',
    buyHoldMonthlyTaxes: '',
    buyHoldMonthlyInsurance: '',
    buyHoldOtherExpenses: '',
    // Subject-To specific
    buyHoldMortgagePayment: '',
    buyHoldCashToSeller: '',
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [isLoadingProperty, setIsLoadingProperty] = useState(false);
  const [existingFrontPhoto, setExistingFrontPhoto] = useState<string | null>(null);
  const [existingContactImage, setExistingContactImage] = useState<string | null>(null);
  const [existingCompanyLogo, setExistingCompanyLogo] = useState<string | null>(null);
  const [isAttomFetching, setIsAttomFetching] = useState(false);
  const [isCompAttomFetching, setIsCompAttomFetching] = useState<Record<number, boolean>>({});

  // Fetch property data when in edit mode
  useEffect(() => {
    const fetchPropertyData = async () => {
      if (!editSlug) return;
      
      setIsLoadingProperty(true);
      try {
        // Fetch property data directly from the properties table to get all fields including company_logo
        const { data: propertyData, error: propertyError } = await supabase
          .from('properties')
          .select('*')
          .eq('address_slug', editSlug)
          .maybeSingle();

        if (propertyError) throw propertyError;
        if (!propertyData) {
          toast({
            title: "Property not found",
            description: "The property you're trying to edit doesn't exist.",
            variant: "destructive"
          });
          setSearchParams({});
          return;
        }

        // Contact info is already in propertyData
        const contactData = propertyData;

        // Map database fields to form data
        const mappedData: FormData = {
          city: propertyData.city || '',
          state: propertyData.state || '',
          zip: propertyData.zip || '',
          dealType: propertyData.deal_type || '',
          hook: propertyData.hook || '',
          generatedTitles: propertyData.generated_titles || [],
          selectedTitle: propertyData.selected_title || '',
          isPremarket: propertyData.is_premarket || false,
          address: propertyData.address || '',
          apn: propertyData.apn || '',
          askingPrice: propertyData.asking_price || '',
          financingTypes: propertyData.financing_types || [],
          financingOther: propertyData.financing_other || '',
          closingDate: propertyData.closing_date || '',
          closingDateType: (propertyData.closing_date_type as 'exact' | 'onBefore') || 'exact',
          photoLink: propertyData.photo_link || '',
          frontPhoto: null,
          isLand: propertyData.is_land || false,
          landCondition: propertyData.land_condition || '',
          roadFrontage: propertyData.road_frontage || '',
          roadFrontageUnit: (propertyData.road_frontage_unit as 'ft' | 'miles') || 'ft',
          bedrooms: propertyData.bedrooms || '',
          bathrooms: propertyData.bathrooms || '',
          squareFootage: propertyData.square_footage || '',
          yearBuilt: propertyData.year_built || '',
          zoning: propertyData.zoning || '',
          lotSize: propertyData.lot_size || '',
          lotSizeUnit: (propertyData.lot_size_unit as 'acres' | 'sqft') || 'acres',
          foundationType: propertyData.foundation_type || '',
          utilities: (Array.isArray(propertyData.utilities) ? propertyData.utilities : []) as string[],
          utilitiesOther: propertyData.utilities_other || '',
          parkingSpaces: propertyData.parking_spaces || '',
          parkingType: (propertyData.parking_type as 'garage' | 'carport' | 'driveway' | '') || '',
          pool: propertyData.pool || false,
          poolType: (propertyData.pool_type as 'inground' | 'above-ground' | '') || '',
          bigTicketItems: (Array.isArray(propertyData.big_ticket_items) && propertyData.big_ticket_items.length > 0 ? propertyData.big_ticket_items : [
            { type: 'Roof', inputFormat: 'year', input: '', ageRange: '', isShitbox: false, noHVAC: false, lastServiced: '' },
            { type: 'HVAC', inputFormat: 'year', input: '', ageRange: '', isShitbox: false, noHVAC: false, lastServiced: '' },
            { type: 'Water Heater', inputFormat: 'year', input: '', ageRange: '', isShitbox: false, noHVAC: false, lastServiced: '' }
          ]) as FormData['bigTicketItems'],
          occupancy: propertyData.current_occupancy || '',
          occupancyOnDelivery: propertyData.closing_occupancy || '',
          includeFinancialBreakdown: propertyData.include_financial_breakdown || false,
          arv: propertyData.arv || '',
          rehabEstimate: propertyData.rehab_estimate || '',
          allIn: propertyData.all_in || '',
          grossProfit: propertyData.gross_profit || '',
          exitStrategy: propertyData.exit_strategy || '',
          includeOnePercentRule: propertyData.include_one_percent_rule ?? true,
          comps: (Array.isArray(propertyData.comps) && propertyData.comps.length > 0 ? propertyData.comps : [
            {
              address: '', zillowLink: '', bedrooms: '', bathrooms: '', squareFootage: '',
              lotSize: '', roadFrontage: '', roadFrontageUnit: 'ft', compType: '',
              conditionLabel: '', assetType: '', assetTypeOther: '', status: '',
              soldListedPrice: '', soldListedPriceType: 'Listed', soldListedDate: '',
              pendingDate: '', currentlyListed: '', dom: '', distanceFromSubject: '', comments: ''
            },
            {
              address: '', zillowLink: '', bedrooms: '', bathrooms: '', squareFootage: '',
              lotSize: '', roadFrontage: '', roadFrontageUnit: 'ft', compType: '',
              conditionLabel: '', assetType: '', assetTypeOther: '', status: '',
              soldListedPrice: '', soldListedPriceType: 'Listed', soldListedDate: '',
              pendingDate: '', currentlyListed: '', dom: '', distanceFromSubject: '', comments: ''
            }
          ]) as FormData['comps'],
          contactName: contactData?.contact_name || '',
          contactPhone: contactData?.contact_phone || '',
          contactEmail: contactData?.contact_email || '',
          officeNumber: contactData?.office_number || '',
          includeBusinessHours: contactData?.business_hours ? true : false,
          businessHours: contactData?.business_hours ? 
            (typeof contactData.business_hours === 'string' ? 
              JSON.parse(contactData.business_hours) : 
              contactData.business_hours) : 
            { startTime: '', endTime: '', timeZone: 'EST' },
          contactImage: null,
          companyLogo: null,
          website: contactData?.website || '',
          emdAmount: propertyData.emd_amount || '',
          emdDueDate: propertyData.emd_due_date || '',
          postPossession: propertyData.post_possession || '',
          additionalDisclosures: propertyData.additional_disclosures || '',
          includeBuyHoldSnapshot: propertyData.include_buy_hold_snapshot || false,
          buyHoldType: (propertyData.buy_hold_type as 'standard' | 'subject-to') || 'standard',
          buyHoldPurchasePrice: propertyData.buy_hold_purchase_price || '',
          buyHoldRehabCost: propertyData.buy_hold_rehab_cost || '',
          buyHoldMonthlyRent: propertyData.buy_hold_monthly_rent || '',
          buyHoldMonthlyTaxes: propertyData.buy_hold_monthly_taxes || '',
          buyHoldMonthlyInsurance: propertyData.buy_hold_monthly_insurance || '',
          buyHoldOtherExpenses: propertyData.buy_hold_other_expenses || '',
          buyHoldMortgagePayment: propertyData.buy_hold_mortgage_payment || '',
          buyHoldCashToSeller: propertyData.buy_hold_cash_to_seller || ''
        };

        setFormData(mappedData);
        
        // Store existing images  
        setExistingFrontPhoto(propertyData.front_photo || null);
        setExistingContactImage(propertyData.contact_image || null);
        setExistingCompanyLogo(propertyData.company_logo || null);

        toast({
          title: "Property loaded",
          description: `Editing: ${propertyData.address}`
        });

      } catch (error) {
        console.error('Error loading property:', error);
        toast({
          title: "Error loading property",
          description: "Unable to load property data. Please try again.",
          variant: "destructive"
        });
        setSearchParams({});
      } finally {
        setIsLoadingProperty(false);
      }
    };

    fetchPropertyData();
  }, [editSlug]);

  // Auto-populate contact info from user profile for new properties
  useEffect(() => {
    const fetchUserProfile = async () => {
      // Only fetch profile when NOT in edit mode and user is authenticated
      if (editSlug || !user) return;

      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) throw error;

        if (data) {
          const businessHours = data.business_hours as { startTime: string; endTime: string; timeZone: string } | null;
          
          // Pre-populate contact fields
          setFormData(prev => ({
            ...prev,
            contactName: data.contact_name || prev.contactName,
            contactPhone: data.contact_phone || prev.contactPhone,
            contactEmail: data.contact_email || prev.contactEmail,
            officeNumber: data.office_number || prev.officeNumber,
            website: data.website || prev.website,
            businessHours: businessHours || prev.businessHours,
          }));

          // Pre-populate existing images for preview
          if (data.contact_image) {
            setExistingContactImage(data.contact_image);
          }
          if (data.company_logo) {
            setExistingCompanyLogo(data.company_logo);
          }
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, [user, editSlug]);

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Helper functions for currency parsing and formatting
  const parseCurrency = (value: string): number => {
    const cleaned = value.replace(/[^0-9.-]/g, '');
    return parseFloat(cleaned) || 0;
  };

  const formatCurrency = (value: number): string => {
    return value > 0 ? `$${value.toLocaleString()}` : '';
  };

  // Auto-calculate All-In Cost (Asking Price + Rehab Estimate)
  useEffect(() => {
    if (formData.includeFinancialBreakdown && formData.rehabEstimate) {
      const askingPrice = parseCurrency(formData.askingPrice);
      const rehabEstimate = parseCurrency(formData.rehabEstimate);
      const allInCost = askingPrice + rehabEstimate;
      
      const formattedAllIn = formatCurrency(allInCost);
      if (formData.allIn !== formattedAllIn) {
        updateFormData('allIn', formattedAllIn);
      }
    }
  }, [formData.askingPrice, formData.rehabEstimate, formData.includeFinancialBreakdown]);

  // Auto-calculate Gross Profit (ARV - All-In Cost)
  useEffect(() => {
    if (formData.includeFinancialBreakdown && formData.arv && formData.allIn) {
      const arv = parseCurrency(formData.arv);
      const allIn = parseCurrency(formData.allIn);
      const grossProfit = arv - allIn;
      
      const formattedProfit = formatCurrency(grossProfit);
      if (formData.grossProfit !== formattedProfit) {
        updateFormData('grossProfit', formattedProfit);
      }
    }
  }, [formData.arv, formData.allIn, formData.includeFinancialBreakdown]);

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
        roadFrontage: '',
        roadFrontageUnit: 'ft',
        compType: '',
        conditionLabel: '',
        assetType: '',
        assetTypeOther: '',
        status: '',
        soldListedPrice: '',
        soldListedPriceType: 'Listed',
        soldListedDate: '',
        pendingDate: '',
        currentlyListed: '',
        dom: '',
        distanceFromSubject: '',
        comments: '',
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

  const handleAttomDataFetch = async () => {
    // Validate address exists
    if (!formData.address) {
      toast({
        title: "Address required",
        description: "Please enter a property address first",
        variant: "destructive"
      });
      return;
    }

    const toastId = toast({
      title: "Fetching property details...",
      description: "Getting data from ATTOM Data API",
    });

    try {
      const { data, error } = await supabase.functions.invoke('fetch-property-details', {
        body: { address: formData.address }
      });

      if (error) {
        console.error('Edge function error:', error);
        throw new Error(error.message || 'Failed to fetch property data');
      }

      if (!data) {
        throw new Error('No data returned from API');
      }

      // Count populated fields
      let populatedCount = 0;

      // Update form data with the response
      setFormData(prev => {
        const updates: Partial<FormData> = {};

        if (data.bedrooms) {
          updates.bedrooms = data.bedrooms;
          populatedCount++;
        }
        if (data.bathrooms) {
          updates.bathrooms = data.bathrooms;
          populatedCount++;
        }
        if (data.squareFootage) {
          updates.squareFootage = data.squareFootage;
          populatedCount++;
        }
        if (data.yearBuilt) {
          updates.yearBuilt = data.yearBuilt;
          populatedCount++;
        }
        if (data.zoning) {
          updates.zoning = data.zoning;
          populatedCount++;
        }

        // Handle lot size - prefer acres
        if (data.lotSizeAcres) {
          updates.lotSize = data.lotSizeAcres.toString();
          updates.lotSizeUnit = 'acres';
          populatedCount++;
        } else if (data.lotSizeSqFt) {
          updates.lotSize = data.lotSizeSqFt.toString();
          updates.lotSizeUnit = 'sqft';
          populatedCount++;
        }

        return { ...prev, ...updates };
      });

      toast({
        title: "Success!",
        description: `Auto-populated ${populatedCount} fields from ATTOM Data`,
      });

    } catch (error) {
      console.error('Error fetching ATTOM data:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch property data",
        variant: "destructive"
      });
    } finally {
      setIsAttomFetching(false);
    }
  };

  const handleCompAttomDataFetch = async (compIndex: number) => {
    const comp = formData.comps[compIndex];
    
    if (!comp.address) {
      toast({
        title: "Address required",
        description: "Please enter a comp address first",
        variant: "destructive"
      });
      return;
    }

    // Basic validation
    const addressParts = comp.address.split(',').map(p => p.trim());
    if (addressParts.length < 2) {
      toast({
        title: "Invalid address format",
        description: "Please enter address in format: Street, City, State",
        variant: "destructive"
      });
      return;
    }

    setIsCompAttomFetching(prev => ({ ...prev, [compIndex]: true }));
    toast({
      title: "Fetching comp details...",
      description: `Getting data for Comp #${compIndex + 1}`,
    });

    try {
      // Create a timeout promise (35 seconds)
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request timed out after 35 seconds')), 35000);
      });

      // Race between the API call and timeout
      const result = await Promise.race([
        supabase.functions.invoke('fetch-property-details', {
          body: { address: comp.address }
        }),
        timeoutPromise
      ]) as any;

      const { data, error } = result;

      if (error) {
        console.error('Edge function error:', error);
        throw new Error(error.message || 'Failed to fetch property data');
      }

      if (!data) {
        throw new Error('No data returned from API');
      }

      // Count populated fields
      let populatedCount = 0;

      // Update the specific comp with the response
      setFormData(prev => {
        const updatedComps = [...prev.comps];
        const compUpdates: any = {};

        // Address - use oneLine if available
        if (data.addressOneLine) {
          compUpdates.address = data.addressOneLine;
          populatedCount++;
        }

        if (data.bedrooms) {
          compUpdates.bedrooms = data.bedrooms;
          populatedCount++;
        }
        if (data.bathrooms) {
          compUpdates.bathrooms = data.bathrooms;
          populatedCount++;
        }
        if (data.squareFootage) {
          compUpdates.squareFootage = data.squareFootage;
          populatedCount++;
        }

        // Handle lot size - format as string with unit
        if (data.lotSizeAcres) {
          compUpdates.lotSize = `${data.lotSizeAcres} acres`;
          populatedCount++;
        } else if (data.lotSizeSqFt) {
          compUpdates.lotSize = `${data.lotSizeSqFt} sq ft`;
          populatedCount++;
        }

        // Sold/Listed Price - format with $ and commas
        if (data.salePrice) {
          const formattedPrice = `$${parseInt(data.salePrice).toLocaleString()}`;
          compUpdates.soldListedPrice = formattedPrice;
          populatedCount++;
        }

        // Sold/Listed Date
        if (data.saleTransDate) {
          compUpdates.soldListedDate = data.saleTransDate;
          populatedCount++;
        }

        updatedComps[compIndex] = { ...updatedComps[compIndex], ...compUpdates };

        return { ...prev, comps: updatedComps };
      });

      toast({
        title: "Success!",
        description: `Auto-populated ${populatedCount} fields for Comp #${compIndex + 1}`,
      });

    } catch (error) {
      console.error('Error fetching ATTOM data for comp:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch comp data",
        variant: "destructive"
      });
    } finally {
      setIsCompAttomFetching(prev => ({ ...prev, [compIndex]: false }));
    }
  };

  const addBigTicketItem = () => {
    setFormData(prev => ({
      ...prev,
      bigTicketItems: [...prev.bigTicketItems, {
        type: '',
        inputFormat: 'year',
        input: '',
        ageRange: '',
        isShitbox: false,
        noHVAC: false,
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

  const updateBigTicketItem = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      bigTicketItems: prev.bigTicketItems.map((item, i) => {
        if (i === index) {
          // If updating inputFormat, clear the input and ageRange values
          if (field === 'inputFormat') {
            return { ...item, [field]: value, input: '', ageRange: '' };
          }
          // If updating input and format is 'age', ensure it's just a number
          if (field === 'input' && item.inputFormat === 'age') {
            // Remove any existing " years old" and non-numeric characters except spaces
            const numericValue = value.replace(/ years old/gi, '').replace(/[^\d\s]/g, '').trim();
            return { ...item, [field]: numericValue };
          }
          return { ...item, [field]: value };
        }
        return item;
      })
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
    const errors: string[] = [];
    const isEditMode = !!editSlug;
    
    // Always-required basics
    if (!formData.city) errors.push('City');
    if (!formData.state) errors.push('State');
    if (!formData.dealType) errors.push('Deal Type');
    if (!formData.isPremarket && !formData.address) errors.push('Full Address (unless premarket)');

    // In edit mode, keep validation minimal to allow quick regeneration
    if (isEditMode) {
      return errors;
    }
    
    // Strict validation for new entries
    if (!formData.askingPrice) errors.push('Asking Price');
    if (!formData.financingTypes.length) errors.push('Financing Types');
    if (!formData.closingDate) errors.push('Closing Date');
    if (!formData.photoLink) errors.push('Photo Link');
    
    // Only validate residential-specific fields if not land
    if (!formData.isLand) {
      if (!formData.bedrooms) errors.push('Bedrooms');
      if (!formData.bathrooms) errors.push('Bathrooms');
      if (!formData.squareFootage) errors.push('Square Footage');
      if (!formData.yearBuilt) errors.push('Year Built');
      if (!formData.occupancy) errors.push('Occupancy');
      if (!formData.occupancyOnDelivery) errors.push('Occupancy on Delivery');
    }
    
    if (!formData.contactName) errors.push('Contact Name');
    if (!formData.contactPhone) errors.push('Contact Phone');
    if (!formData.contactEmail?.trim()) errors.push('Contact Email');
    
    // Validate big ticket systems only for residential properties
    if (!formData.isLand) {
      // Roof is always required
      const roofItem = formData.bigTicketItems.find(item => item.type === 'Roof');
      if (!roofItem || (!roofItem.input.trim() && !roofItem.ageRange.trim() && !roofItem.isShitbox)) {
        errors.push('Roof year/age/range');
      }
      
      // HVAC is required unless "No HVAC" is checked
      const hvacItem = formData.bigTicketItems.find(item => item.type === 'HVAC');
      if (!hvacItem || (!hvacItem.input.trim() && !hvacItem.ageRange.trim() && !hvacItem.isShitbox && !hvacItem.noHVAC)) {
        errors.push('HVAC year/age/range or No HVAC selection');
      }
      
      // Water Heater is now optional - no validation needed
    }
    
    // Validate at least 2 comps with required fields
    const validComps = formData.comps.filter(comp => 
      comp.address && comp.compType && comp.assetType && 
      (!formData.isLand ? comp.bedrooms && comp.bathrooms && comp.squareFootage : true)
    );
    if (validComps.length < 2) errors.push('At least 2 complete comps');
    
    return errors;
  };

  const handleGeneratePDF = async () => {
    // Check if user is authenticated
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to create or edit property listings.",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }

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

    // Use new file if uploaded, otherwise fall back to existing image
    if (formData.frontPhoto) {
      frontPhotoBase64 = await convertFileToBase64(formData.frontPhoto);
    } else if (existingFrontPhoto) {
      frontPhotoBase64 = existingFrontPhoto;
    }

    if (formData.contactImage) {
      contactImageBase64 = await convertFileToBase64(formData.contactImage);
    } else if (existingContactImage) {
      contactImageBase64 = existingContactImage;
    }

    if (formData.companyLogo) {
      companyLogoBase64 = await convertFileToBase64(formData.companyLogo);
    } else if (existingCompanyLogo) {
      companyLogoBase64 = existingCompanyLogo;
    }

      // Create address slug (preserve existing slug in edit mode)
      const addressSlug = editSlug || (
        formData.isPremarket 
          ? slugify(`${formData.city}-${formData.state}-premarket-${Date.now()}`)
          : slugify(formData.address)
      );

      // Create display strings for compound fields
      const poolDisplay = formData.pool ? 
        (formData.poolType ? `${formData.poolType.replace('-', ' ')} pool` : 'pool') : '';
      
      const lotSizeDisplay = formData.lotSize ? 
        `${formData.lotSize} ${formData.lotSizeUnit}` : '';
        
      const roadFrontageDisplay = formData.roadFrontage ? 
        `${formData.roadFrontage} ${formData.roadFrontageUnit}` : '';
        
      const closingDateDisplay = formData.closingDate ? 
        (formData.closingDateType === 'onBefore' ? `On or before ${formData.closingDate}` : formData.closingDate) : '';

      // Prepare data for webhook
      const webhookData = {
        ...formData,
        user_id: user.id,
        frontPhoto: frontPhotoBase64,
        contactImage: contactImageBase64,
        companyLogo: companyLogoBase64,
        title: formData.selectedTitle || formData.generatedTitles[0] || `${formData.city} ${formData.dealType} Opportunity`,
        subtitle: `${formData.dealType} Investment Property - ${formData.isPremarket ? `${formData.city}, ${formData.state}` : formData.address}`,
        
        // Display strings for compound fields
        poolDisplay,
        lotSizeDisplay,
        roadFrontageDisplay,
        closingDateDisplay,
        
        // Format big ticket items with proper age formatting
        bigTicketItems: formData.bigTicketItems.map(item => ({
          type: item.type,
          age: item.inputFormat === 'age' && item.input.trim() 
            ? `${item.input.trim()} years old`
            : item.inputFormat === 'age-range' && item.ageRange.trim()
            ? `${item.ageRange.trim()} years old`
            : item.noHVAC && item.type === 'HVAC'
            ? 'No HVAC'
            : item.input,
          ageType: item.inputFormat === 'age' ? 'specific' : item.inputFormat === 'age-range' ? 'range' : 'specific',
          specificYear: item.inputFormat === 'year' ? item.input : '',
          isShitbox: item.isShitbox,
          noHVAC: item.noHVAC || false,
          lastServiced: item.lastServiced
        })),
        
        // Buy & Hold Calculations (only include if there's data)
        buyHoldAnalysis: (formData.buyHoldPurchasePrice || formData.buyHoldMonthlyRent) ? {
          type: formData.buyHoldType,
          purchasePrice: formData.buyHoldPurchasePrice,
          rehabCost: formData.buyHoldRehabCost,
          monthlyRent: formData.buyHoldMonthlyRent,
          monthlyTaxes: formData.buyHoldMonthlyTaxes,
          monthlyInsurance: formData.buyHoldMonthlyInsurance,
          mortgageTerms: formData.buyHoldMortgagePayment,
          otherExpenses: formData.buyHoldOtherExpenses,
          // Subject-To specific fields
          cashToSeller: formData.buyHoldCashToSeller,
          calculations: {
            allInCost: (() => {
              const purchase = parseFloat(formData.buyHoldPurchasePrice.replace(/[^\d.]/g, '')) || 0;
              const rehab = parseFloat(formData.buyHoldRehabCost.replace(/[^\d.]/g, '')) || 0;
              return purchase + rehab;
            })(),
            grossMonthlyIncome: parseFloat(formData.buyHoldMonthlyRent.replace(/[^\d.]/g, '')) || 0,
            monthlyExpenses: (() => {
              const taxes = parseFloat(formData.buyHoldMonthlyTaxes.replace(/[^\d.]/g, '')) || 0;
              const insurance = parseFloat(formData.buyHoldMonthlyInsurance.replace(/[^\d.]/g, '')) || 0;
              const other = parseFloat(formData.buyHoldOtherExpenses.replace(/[^\d.]/g, '')) || 0;
              // For Subject-To, include mortgage payment in expenses
              const mortgage = formData.buyHoldType === 'subject-to' ? 
                (parseFloat(formData.buyHoldMortgagePayment.replace(/[^\d.]/g, '')) || 0) : 0;
              return taxes + insurance + other + mortgage;
            })(),
            noi: (() => {
              const rent = parseFloat(formData.buyHoldMonthlyRent.replace(/[^\d.]/g, '')) || 0;
              const taxes = parseFloat(formData.buyHoldMonthlyTaxes.replace(/[^\d.]/g, '')) || 0;
              const insurance = parseFloat(formData.buyHoldMonthlyInsurance.replace(/[^\d.]/g, '')) || 0;
              return rent - taxes - insurance;
            })(),
            monthlyCashFlow: (() => {
              const rent = parseFloat(formData.buyHoldMonthlyRent.replace(/[^\d.]/g, '')) || 0;
              const taxes = parseFloat(formData.buyHoldMonthlyTaxes.replace(/[^\d.]/g, '')) || 0;
              const insurance = parseFloat(formData.buyHoldMonthlyInsurance.replace(/[^\d.]/g, '')) || 0;
              const other = parseFloat(formData.buyHoldOtherExpenses.replace(/[^\d.]/g, '')) || 0;
              // For Subject-To, include mortgage payment in cash flow calculation
              const mortgage = formData.buyHoldType === 'subject-to' ? 
                (parseFloat(formData.buyHoldMortgagePayment.replace(/[^\d.]/g, '')) || 0) : 0;
              return rent - taxes - insurance - other - mortgage;
            })(),
            cashOnCashReturn: (() => {
              const rent = parseFloat(formData.buyHoldMonthlyRent.replace(/[^\d.]/g, '')) || 0;
              const taxes = parseFloat(formData.buyHoldMonthlyTaxes.replace(/[^\d.]/g, '')) || 0;
              const insurance = parseFloat(formData.buyHoldMonthlyInsurance.replace(/[^\d.]/g, '')) || 0;
              const other = parseFloat(formData.buyHoldOtherExpenses.replace(/[^\d.]/g, '')) || 0;
              const purchase = parseFloat(formData.buyHoldPurchasePrice.replace(/[^\d.]/g, '')) || 0;
              const rehab = parseFloat(formData.buyHoldRehabCost.replace(/[^\d.]/g, '')) || 0;
              
              // For Subject-To, calculate cash invested differently
              let cashInvested;
              if (formData.buyHoldType === 'subject-to') {
                const cashToSeller = parseFloat(formData.buyHoldCashToSeller.replace(/[^\d.]/g, '')) || 0;
                cashInvested = cashToSeller + rehab;
              } else {
                cashInvested = purchase + rehab;
              }
              
              const mortgage = formData.buyHoldType === 'subject-to' ? 
                (parseFloat(formData.buyHoldMortgagePayment.replace(/[^\d.]/g, '')) || 0) : 0;
              const annualCashFlow = (rent - taxes - insurance - other - mortgage) * 12;
              return cashInvested > 0 ? (annualCashFlow / cashInvested) * 100 : 0;
            })(),
            capRate: (() => {
              const rent = parseFloat(formData.buyHoldMonthlyRent.replace(/[^\d.]/g, '')) || 0;
              const taxes = parseFloat(formData.buyHoldMonthlyTaxes.replace(/[^\d.]/g, '')) || 0;
              const insurance = parseFloat(formData.buyHoldMonthlyInsurance.replace(/[^\d.]/g, '')) || 0;
              const purchase = parseFloat(formData.buyHoldPurchasePrice.replace(/[^\d.]/g, '')) || 0;
              const rehab = parseFloat(formData.buyHoldRehabCost.replace(/[^\d.]/g, '')) || 0;
              const allIn = purchase + rehab;
              const annualNOI = (rent - taxes - insurance) * 12;
              return allIn > 0 ? (annualNOI / allIn) * 100 : 0;
            })(),
            onePercentRule: (() => {
              const rent = parseFloat(formData.buyHoldMonthlyRent.replace(/[^\d.]/g, '')) || 0;
              const purchase = parseFloat(formData.buyHoldPurchasePrice.replace(/[^\d.]/g, '')) || 0;
              return purchase > 0 ? (rent / purchase) * 100 : 0;
            })()
          }
        } : null
      };

      // Create parking display string
      const parkingDisplay = formData.parkingSpaces ? 
        `${formData.parkingType} ${formData.parkingSpaces}-space parking` : '';

      // Create business hours display string
      const businessHoursDisplay = (() => {
        const businessHours = formData.businessHours;
        if (!businessHours.startTime || !businessHours.endTime) return 'Hours not specified';
        
        const formatTime = (time: string) => {
          // Handle both 24-hour format (e.g., "09:00") and 12-hour format (e.g., "9:00 AM")
          if (time.includes('AM') || time.includes('PM')) {
            // Legacy 12-hour format - return as is
            return time;
          }
          
          // 24-hour format - convert to 12-hour
          const [hour, minute] = time.split(':');
          const h = parseInt(hour);
          const ampm = h >= 12 ? 'PM' : 'AM';
          const displayHour = h === 0 ? 12 : h > 12 ? h - 12 : h;
          return `${displayHour}:${minute} ${ampm}`;
        };
        
        return `${formatTime(businessHours.startTime)} - ${formatTime(businessHours.endTime)} (${businessHours.timeZone})`;
      })();

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
        closing_date: closingDateDisplay,
        photo_link: formData.photoLink,
        front_photo: frontPhotoBase64,
        bedrooms: formData.bedrooms,
        bathrooms: formData.bathrooms,
        square_footage: formData.squareFootage,
        year_built: formData.yearBuilt,
        zoning: formData.zoning,
        lot_size: lotSizeDisplay,
        foundation_type: formData.foundationType,
        utilities: Array.isArray(formData.utilities) ? 
          formData.utilities.concat(formData.utilitiesOther ? [formData.utilitiesOther] : []).join(', ') : 
          formData.utilities,
        garage: parkingDisplay,
        pool: poolDisplay || (formData.pool ? 'Yes' : 'No'),
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
        business_hours: formData.includeBusinessHours ? businessHoursDisplay : null,
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
      const response = await fetch('https://dealblaster.app.n8n.cloud/webhook/dealblaster', {
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

      // Save all form data to Supabase
      const propertyRecord = {
        // Required fields
        address_slug: addressSlug,
        html_content: htmlResult,
        city: formData.city,
        deal_type: formData.dealType,
        address: formData.address,
        
        // Listing Headline
        state: formData.state,
        zip: formData.zip,
        hook: formData.hook,
        generated_titles: formData.generatedTitles,
        selected_title: formData.selectedTitle,
        is_premarket: formData.isPremarket,
        
        // Basic Info
        apn: formData.apn,
        asking_price: formData.askingPrice,
        financing_types: formData.financingTypes,
        financing_other: formData.financingOther,
        closing_date: formData.closingDate,
        closing_date_type: formData.closingDateType,
        
        // Photos
        photo_link: formData.photoLink,
        front_photo: frontPhotoBase64,
        
        // Land
        is_land: formData.isLand,
        land_condition: formData.landCondition,
        road_frontage: formData.roadFrontage,
        road_frontage_unit: formData.roadFrontageUnit,
        
        // Property Overview
        bedrooms: formData.bedrooms,
        bathrooms: formData.bathrooms,
        square_footage: formData.squareFootage,
        year_built: formData.yearBuilt,
        zoning: formData.zoning,
        lot_size: formData.lotSize,
        lot_size_unit: formData.lotSizeUnit,
        foundation_type: formData.foundationType,
        utilities: formData.utilities,
        utilities_other: formData.utilitiesOther,
        
        // Parking
        parking_spaces: formData.parkingSpaces,
        parking_type: formData.parkingType,
        
        // Pool
        pool: formData.pool,
        pool_type: formData.poolType,
        
        // Big Ticket Items
        big_ticket_items: formData.bigTicketItems,
        
        // Occupancy
        current_occupancy: formData.occupancy,
        closing_occupancy: formData.occupancyOnDelivery,
        
        // Financial Snapshot
        include_financial_breakdown: formData.includeFinancialBreakdown,
        arv: formData.arv,
        rehab_estimate: formData.rehabEstimate,
        all_in: formData.allIn,
        gross_profit: formData.grossProfit,
        exit_strategy: formData.exitStrategy,
        
        // 1% Rule
        include_one_percent_rule: formData.includeOnePercentRule,
        
        // Buy & Hold Snapshot
        include_buy_hold_snapshot: formData.includeBuyHoldSnapshot,
        // Buy & Hold Snapshot - only include data if checkbox is checked
        ...(formData.includeBuyHoldSnapshot ? {
          buy_hold_type: formData.buyHoldType,
          buy_hold_purchase_price: formData.buyHoldPurchasePrice,
          buy_hold_rehab_cost: formData.buyHoldRehabCost,
          buy_hold_monthly_rent: formData.buyHoldMonthlyRent,
          buy_hold_monthly_taxes: formData.buyHoldMonthlyTaxes,
          buy_hold_monthly_insurance: formData.buyHoldMonthlyInsurance,
          buy_hold_other_expenses: formData.buyHoldOtherExpenses,
          buy_hold_mortgage_payment: formData.buyHoldMortgagePayment,
          buy_hold_cash_to_seller: formData.buyHoldCashToSeller,
        } : {
          buy_hold_type: null,
          buy_hold_purchase_price: null,
          buy_hold_rehab_cost: null,
          buy_hold_monthly_rent: null,
          buy_hold_monthly_taxes: null,
          buy_hold_monthly_insurance: null,
          buy_hold_other_expenses: null,
          buy_hold_mortgage_payment: null,
          buy_hold_cash_to_seller: null,
        }),
        
        // Comps
        comps: formData.comps,
        
        // Contact Info
        contact_name: formData.contactName,
        contact_phone: formData.contactPhone,
        contact_email: formData.contactEmail,
        office_number: formData.officeNumber,
        business_hours: formData.includeBusinessHours ? JSON.stringify(formData.businessHours) : null,
        contact_image: contactImageBase64,
        company_logo: companyLogoBase64,
        website: formData.website,
        
        // Legal Disclosures
        emd_amount: formData.emdAmount,
        emd_due_date: formData.emdDueDate,
        post_possession: formData.postPossession,
        additional_disclosures: formData.additionalDisclosures,
      };

      const { data: insertResult, error: supabaseError } = await (supabase as any)
        .rpc('secure_upsert_property', { 
          property_data: propertyRecord
        });

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
    const fullUrl = buildAbsoluteShareUrl(shareUrl);
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
    <AuthGate>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Header />
        <div className="p-4">
          <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-2">
            <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-2">
              <Building className="h-8 w-8 text-blue-600" />
              Property Flyer Generator
            </h1>
            <Button 
              variant="outline" 
              onClick={() => navigate('/test')}
              className="flex items-center gap-2"
            >
              Test with Preset Data
            </Button>
          </div>
          <p className="text-gray-600">Create professional investment property flyers in minutes</p>
        </div>

        {/* Edit Mode Banner */}
        {editSlug && (
          <Alert className="mb-6">
            <AlertDescription className="flex items-center justify-between">
              <span className="font-medium">
                Editing Property: {formData.address || editSlug}
              </span>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setSearchParams({});
                  window.location.reload();
                }}
              >
                Start New Property
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {isLoadingProperty && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading property data...</p>
          </div>
        )}

        <div className="space-y-6">
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
                    onChange={(e) => {
                      const newAddress = e.target.value;
                      updateFormData('address', newAddress);
                      
                      // Auto-fill city, state, and zip from address
                      // Expected format: "Street Address, City, State Zip"
                      const parts = newAddress.split(',').map(p => p.trim());
                      if (parts.length >= 3) {
                        // City is the second part (after street address)
                        const city = parts[1];
                        
                        // State and Zip are in the last part
                        const stateZipPart = parts[parts.length - 1];
                        const stateZipMatch = stateZipPart.match(/^([A-Z]{2})\s+(\d{5})$/i);
                        
                        if (stateZipMatch) {
                          const state = stateZipMatch[1].toUpperCase();
                          const zip = stateZipMatch[2];
                          
                          // Auto-populate the fields
                          updateFormData('city', city);
                          updateFormData('state', state);
                          updateFormData('zip', zip);
                        }
                      }
                    }}
                  />
                </div>
              )}

              <div>
                <Label htmlFor="apn">APN {formData.isLand ? '*' : '(Optional)'}</Label>
                <Input
                  id="apn"
                  placeholder="123456789"
                  value={formData.apn}
                  onChange={(e) => {
                    // Only allow digits
                    const value = e.target.value.replace(/\D/g, '');
                    updateFormData('apn', value);
                  }}
                />
              </div>

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
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formData.closingDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.closingDate ? (
                          format(new Date(formData.closingDate), "MM/dd/yyyy")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.closingDate ? new Date(formData.closingDate) : undefined}
                        onSelect={(date) => updateFormData('closingDate', date ? date.toISOString() : '')}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </CardContent>
          </Card>

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

          {/* Property Type */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Property Type
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="isLand" 
                  checked={formData.isLand}
                  onCheckedChange={(checked) => updateFormData('isLand', checked)}
                />
                <Label htmlFor="isLand">Is this Land?</Label>
              </div>

              {formData.isLand && (
                <div className="space-y-4 p-4 border rounded-lg bg-amber-50">
                  <h4 className="font-medium">Land-Specific Information</h4>
                  
                  <div>
                    <Label htmlFor="landCondition">Land Condition</Label>
                    <Select value={formData.landCondition} onValueChange={(value) => updateFormData('landCondition', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select land condition" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="wooded">Wooded</SelectItem>
                        <SelectItem value="partially-cleared">Partially Cleared</SelectItem>
                        <SelectItem value="cleared">Cleared</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="roadFrontage">Road Frontage (Optional)</Label>
                    <div className="flex gap-2">
                      <Input
                        id="roadFrontage"
                        type="number"
                        step="0.1"
                        placeholder="100"
                        value={formData.roadFrontage}
                        onChange={(e) => updateFormData('roadFrontage', e.target.value)}
                        className="flex-1"
                      />
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="roadFrontageUnit-ft"
                          checked={formData.roadFrontageUnit === 'ft'}
                          onCheckedChange={(checked) => updateFormData('roadFrontageUnit', checked ? 'ft' : 'miles')}
                        />
                        <Label htmlFor="roadFrontageUnit-ft" className="text-sm">Ft</Label>
                        <Checkbox 
                          id="roadFrontageUnit-miles"
                          checked={formData.roadFrontageUnit === 'miles'}
                          onCheckedChange={(checked) => updateFormData('roadFrontageUnit', checked ? 'miles' : 'ft')}
                        />
                        <Label htmlFor="roadFrontageUnit-miles" className="text-sm">Miles</Label>
                      </div>
                    </div>
                  </div>
                </div>
              )}
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
                {existingFrontPhoto && !formData.frontPhoto && (
                  <div className="mb-2 p-2 border rounded">
                    <p className="text-sm text-muted-foreground mb-1">Current photo:</p>
                    <img src={existingFrontPhoto} alt="Current front photo" className="max-h-32 object-contain" />
                  </div>
                )}
                <Input
                  id="frontPhoto"
                  type="file"
                  accept="image/*"
                  onChange={(e) => updateFormData('frontPhoto', e.target.files?.[0] || null)}
                />
                {existingFrontPhoto && !formData.frontPhoto && (
                  <p className="text-xs text-muted-foreground mt-1">Upload a new photo to replace the current one</p>
                )}
              </div>
            </CardContent>
          </Card>


          {/* Property Overview */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Property Overview
                </CardTitle>
                {formData.address && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAttomDataFetch}
                    disabled={isAttomFetching}
                    className="flex items-center gap-2"
                  >
                    <Database className="h-4 w-4" />
                    {isAttomFetching ? 'Fetching...' : 'Auto-Fill from ATTOM Data'}
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {!formData.isLand && (
                  <>
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
                  </>
                )}
                {!formData.isLand && (
                  <div>
                    <Label htmlFor="squareFootage">Square Footage *</Label>
                    <Input
                      id="squareFootage"
                      placeholder="1,200"
                      value={formData.squareFootage}
                      onChange={(e) => updateFormData('squareFootage', e.target.value)}
                    />
                  </div>
                )}
                {!formData.isLand && (
                  <div>
                    <Label htmlFor="yearBuilt">Year Built *</Label>
                    <Input
                      id="yearBuilt"
                      placeholder="1985"
                      value={formData.yearBuilt}
                      onChange={(e) => updateFormData('yearBuilt', e.target.value)}
                    />
                  </div>
                )}
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
                  <div className="flex gap-2">
                    <Input
                      id="lotSize"
                      type="number"
                      step="0.01"
                      placeholder="0.25"
                      value={formData.lotSize}
                      onChange={(e) => updateFormData('lotSize', e.target.value)}
                      className="flex-1"
                    />
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="lotSizeAcres"
                        checked={formData.lotSizeUnit === 'acres'}
                        onCheckedChange={(checked) => updateFormData('lotSizeUnit', checked ? 'acres' : 'sqft')}
                      />
                      <Label htmlFor="lotSizeAcres" className="text-sm">Acres</Label>
                      <Checkbox 
                        id="lotSizeSqFt"
                        checked={formData.lotSizeUnit === 'sqft'}
                        onCheckedChange={(checked) => updateFormData('lotSizeUnit', checked ? 'sqft' : 'acres')}
                      />
                      <Label htmlFor="lotSizeSqFt" className="text-sm">Sq Ft</Label>
                    </div>
                  </div>
                  {formData.lotSize && (
                    <p className="text-sm text-gray-600 mt-1">
                      Display: "{formData.lotSize} {formData.lotSizeUnit}"
                    </p>
                  )}
                </div>
              </div>

              {!formData.isLand && (
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
              )}

              {!formData.isLand && (
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
              )}

              {!formData.isLand && (
                <>
                  <div>
                    <Label>Parking Options</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                      <div>
                        <Label htmlFor="parkingSpaces">Number of Parking Spaces</Label>
                        <Input
                          id="parkingSpaces"
                          type="number"
                          placeholder="2"
                          value={formData.parkingSpaces}
                          onChange={(e) => updateFormData('parkingSpaces', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="parkingType">Parking Type</Label>
                        <Select value={formData.parkingType} onValueChange={(value) => updateFormData('parkingType', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="garage">Garage</SelectItem>
                            <SelectItem value="carport">Carport</SelectItem>
                            <SelectItem value="driveway">Driveway</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    {formData.parkingSpaces && formData.parkingType && (
                      <p className="text-sm text-gray-600 mt-2">
                        Display: "{formData.parkingSpaces} {formData.parkingType} spaces"
                      </p>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <Checkbox 
                        id="pool" 
                        checked={formData.pool}
                        onCheckedChange={(checked) => {
                          updateFormData('pool', checked);
                          if (!checked) updateFormData('poolType', '');
                        }}
                      />
                      <Label htmlFor="pool">Pool</Label>
                    </div>
                    {formData.pool && (
                      <div className="ml-6">
                        <Label htmlFor="poolType">Pool Type</Label>
                        <Select value={formData.poolType} onValueChange={(value) => updateFormData('poolType', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select pool type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="inground">Inground</SelectItem>
                            <SelectItem value="above-ground">Above-ground</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Big Ticket Systems */}
          {!formData.isLand && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wrench className="h-5 w-5" />
                  Big Ticket Systems (Required)
                </CardTitle>
                <CardDescription>Information about major home systems - enter year (e.g., "2010") or age (e.g., "10 years old")</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {formData.bigTicketItems.map((item, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <Label htmlFor={`item-type-${index}`}>
                          System Type{(item.type === 'Water Heater') ? '' : ' *'}
                        </Label>
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

                    {/* Format Selector */}
                    <div>
                      <Label htmlFor={`format-${index}`}>
                        Input Format{(item.isShitbox || (item.type === 'HVAC' && item.noHVAC) || item.type === 'Water Heater') ? '' : ' *'}
                      </Label>
                      <Select
                        value={item.inputFormat}
                        onValueChange={(value) => updateBigTicketItem(index, 'inputFormat', value)}
                      >
                        <SelectTrigger className="bg-background border z-50">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-background border shadow-lg z-50">
                          <SelectItem value="year">Year (e.g., 2010)</SelectItem>
                          <SelectItem value="age">Age (e.g., 10)</SelectItem>
                          <SelectItem value="age-range">Age Range (e.g., 0-5 years)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Input Field - Show different inputs based on format */}
                    {item.inputFormat === 'age-range' ? (
                      <div>
                        <Label htmlFor={`ageRange-${index}`}>
                          Age Range{(item.isShitbox || (item.type === 'HVAC' && item.noHVAC) || item.type === 'Water Heater') ? '' : ' *'}
                        </Label>
                        <Select
                          value={item.ageRange}
                          onValueChange={(value) => updateBigTicketItem(index, 'ageRange', value)}
                        >
                          <SelectTrigger className="bg-background border z-50">
                            <SelectValue placeholder="Select age range" />
                          </SelectTrigger>
                          <SelectContent className="bg-background border shadow-lg z-50">
                            <SelectItem value="0-5">0-5 years</SelectItem>
                            <SelectItem value="6-10">6-10 years</SelectItem>
                            <SelectItem value="11-15">11-15 years</SelectItem>
                            <SelectItem value="16-20">16-20 years</SelectItem>
                            <SelectItem value="20+">20+ years</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-sm text-muted-foreground mt-1">
                          Select the age range for this system
                        </p>
                      </div>
                    ) : (
                      <div>
                        <Label htmlFor={`input-${index}`}>
                          {item.inputFormat === 'year' 
                            ? `Year Installed${(item.isShitbox || (item.type === 'HVAC' && item.noHVAC) || item.type === 'Water Heater') ? '' : ' *'}`
                            : `Age in Years${(item.isShitbox || (item.type === 'HVAC' && item.noHVAC) || item.type === 'Water Heater') ? '' : ' *'}`
                          }
                        </Label>
                        <Input
                          id={`input-${index}`}
                          placeholder={item.inputFormat === 'year' ? 'e.g., 2010' : 'e.g., 10'}
                          value={item.input}
                          onChange={(e) => updateBigTicketItem(index, 'input', e.target.value)}
                        />
                        <p className="text-sm text-muted-foreground mt-1">
                          {item.inputFormat === 'year' 
                            ? 'Enter the year it was installed (e.g., "2010")'
                            : 'Enter age in years (e.g., "10") - "years old" will be added automatically'
                          }
                        </p>
                      </div>
                    )}

                    <div className="flex items-center space-x-2">
                      <input
                        id={`shitbox-${index}`}
                        type="checkbox"
                        checked={item.isShitbox}
                        onChange={(e) => updateBigTicketItem(index, 'isShitbox', e.target.checked)}
                        className="rounded border border-gray-300"
                      />
                      <Label htmlFor={`shitbox-${index}`}>Shitbox (Distressed Property)</Label>
                    </div>

                    {/* No HVAC option - only show for HVAC items */}
                    {item.type === 'HVAC' && (
                      <div className="flex items-center space-x-2">
                        <input
                          id={`noHVAC-${index}`}
                          type="checkbox"
                          checked={item.noHVAC}
                          onChange={(e) => updateBigTicketItem(index, 'noHVAC', e.target.checked)}
                          className="rounded border border-gray-300"
                        />
                        <Label htmlFor={`noHVAC-${index}`}>No HVAC?</Label>
                      </div>
                    )}

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
                  Add Additional System
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Occupancy */}
          {!formData.isLand && (
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
          )}

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
                    <Label htmlFor="allIn">All-In Cost (Auto-calculated)</Label>
                    <Input
                      id="allIn"
                      placeholder="Auto-calculated"
                      value={formData.allIn}
                      readOnly
                      className="bg-muted cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <Label htmlFor="grossProfit">Gross Profit (Auto-calculated)</Label>
                    <Input
                      id="grossProfit"
                      placeholder="Auto-calculated"
                      value={formData.grossProfit}
                      readOnly
                      className="bg-muted cursor-not-allowed"
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

          {/* Buy & Hold Snapshot Section - Moved from after Comps */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                🏡 Buy & Hold Snapshot
              </CardTitle>
              <CardDescription>Optional rental analysis for investment properties</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="includeBuyHoldSnapshot" 
                  checked={formData.includeBuyHoldSnapshot}
                  onCheckedChange={(checked) => updateFormData('includeBuyHoldSnapshot', checked)}
                />
                <Label htmlFor="includeBuyHoldSnapshot" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Include Buy & Hold analysis in listing
                </Label>
              </div>

              {formData.includeBuyHoldSnapshot && (
                <div className="space-y-4">
                  {/* Financing Type Selector */}
                  <div>
                    <Label htmlFor="buyHoldType">Financing Type</Label>
                    <Select
                      value={formData.buyHoldType}
                      onValueChange={(value) => updateFormData('buyHoldType', value as 'standard' | 'subject-to')}
                    >
                      <SelectTrigger className="bg-background border z-50">
                        <SelectValue placeholder="Select financing type" />
                      </SelectTrigger>
                      <SelectContent className="bg-background border shadow-lg z-50">
                        <SelectItem value="standard">Standard (Cash/Conventional)</SelectItem>
                        <SelectItem value="subject-to">Subject-To (Sub-To)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Standard Type Inputs */}
                  {formData.buyHoldType === 'standard' && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="buyHoldPurchasePrice">Purchase Price</Label>
                          <Input
                            id="buyHoldPurchasePrice"
                            placeholder="$250,000"
                            value={formData.buyHoldPurchasePrice}
                            onChange={(e) => updateFormData('buyHoldPurchasePrice', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="buyHoldRehabCost">Rehab Estimate</Label>
                          <Input
                            id="buyHoldRehabCost"
                            placeholder="$25,000"
                            value={formData.buyHoldRehabCost}
                            onChange={(e) => updateFormData('buyHoldRehabCost', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="buyHoldMonthlyRent">Est. Monthly Rent</Label>
                          <Input
                            id="buyHoldMonthlyRent"
                            placeholder="$2,200"
                            value={formData.buyHoldMonthlyRent}
                            onChange={(e) => updateFormData('buyHoldMonthlyRent', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="buyHoldMonthlyTaxes">Est. Monthly Taxes</Label>
                          <Input
                            id="buyHoldMonthlyTaxes"
                            placeholder="$350"
                            value={formData.buyHoldMonthlyTaxes}
                            onChange={(e) => updateFormData('buyHoldMonthlyTaxes', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="buyHoldMonthlyInsurance">Est. Monthly Insurance</Label>
                          <Input
                            id="buyHoldMonthlyInsurance"
                            placeholder="$150"
                            value={formData.buyHoldMonthlyInsurance}
                            onChange={(e) => updateFormData('buyHoldMonthlyInsurance', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="buyHoldOtherExpenses">Other Monthly Expenses</Label>
                          <Input
                            id="buyHoldOtherExpenses"
                            placeholder="$300 (optional)"
                            value={formData.buyHoldOtherExpenses}
                            onChange={(e) => updateFormData('buyHoldOtherExpenses', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Subject-To Type Inputs */}
                  {formData.buyHoldType === 'subject-to' && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="buyHoldMonthlyRent">Est. Monthly Rent</Label>
                          <Input
                            id="buyHoldMonthlyRent"
                            placeholder="$2,200"
                            value={formData.buyHoldMonthlyRent}
                            onChange={(e) => updateFormData('buyHoldMonthlyRent', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="buyHoldMonthlyTaxes">Est. Monthly Taxes</Label>
                          <Input
                            id="buyHoldMonthlyTaxes"
                            placeholder="$350"
                            value={formData.buyHoldMonthlyTaxes}
                            onChange={(e) => updateFormData('buyHoldMonthlyTaxes', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="buyHoldMonthlyInsurance">Est. Monthly Insurance</Label>
                          <Input
                            id="buyHoldMonthlyInsurance"
                            placeholder="$150"
                            value={formData.buyHoldMonthlyInsurance}
                            onChange={(e) => updateFormData('buyHoldMonthlyInsurance', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="buyHoldMortgagePayment">Monthly Mortgage Payment</Label>
                          <Input
                            id="buyHoldMortgagePayment"
                            placeholder="$1,200"
                            value={formData.buyHoldMortgagePayment}
                            onChange={(e) => updateFormData('buyHoldMortgagePayment', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="buyHoldCashToSeller">Cash-to-Seller</Label>
                          <Input
                            id="buyHoldCashToSeller"
                            placeholder="$10,000"
                            value={formData.buyHoldCashToSeller}
                            onChange={(e) => updateFormData('buyHoldCashToSeller', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 1% Rule Toggle */}
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="includeOnePercentRule"
                      checked={formData.includeOnePercentRule}
                      onCheckedChange={(checked) => updateFormData('includeOnePercentRule', checked)}
                    />
                    <Label htmlFor="includeOnePercentRule" className="text-sm">
                      Include 1% Rule Check in listing
                    </Label>
                  </div>

                  {/* Investment Analysis - Show if we have rent data */}
                  {formData.buyHoldMonthlyRent && (
                    <div className="mt-6 p-4 bg-muted/30 rounded-lg">
                      <h4 className="font-semibold mb-3 text-foreground">Investment Analysis</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                        {/* Standard Calculations */}
                        {formData.buyHoldType === 'standard' && (
                          <>
                            <div>
                              <span className="font-medium text-muted-foreground">All-In Cost:</span>
                              <div className="text-lg font-bold text-primary">
                                {(() => {
                                  const purchase = parseFloat(formData.buyHoldPurchasePrice.replace(/[^\d.]/g, '')) || 0;
                                  const rehab = parseFloat(formData.buyHoldRehabCost.replace(/[^\d.]/g, '')) || 0;
                                  const allIn = purchase + rehab;
                                  return allIn > 0 ? `$${allIn.toLocaleString()}` : '$0';
                                })()}
                              </div>
                            </div>
                            
                            <div>
                              <span className="font-medium text-muted-foreground">Cash Flow:</span>
                              <div className="text-lg font-bold text-green-600">
                                {(() => {
                                  const rent = parseFloat(formData.buyHoldMonthlyRent.replace(/[^\d.]/g, '')) || 0;
                                  const taxes = parseFloat(formData.buyHoldMonthlyTaxes.replace(/[^\d.]/g, '')) || 0;
                                  const insurance = parseFloat(formData.buyHoldMonthlyInsurance.replace(/[^\d.]/g, '')) || 0;
                                  const other = parseFloat(formData.buyHoldOtherExpenses.replace(/[^\d.]/g, '')) || 0;
                                  const cashFlow = rent - taxes - insurance - other;
                                  return cashFlow !== 0 ? `$${cashFlow.toLocaleString()}` : '$0';
                                })()}
                              </div>
                            </div>
                            
                            <div>
                              <span className="font-medium text-muted-foreground">Cap Rate:</span>
                              <div className="text-lg font-bold text-blue-600">
                                {(() => {
                                  const rent = parseFloat(formData.buyHoldMonthlyRent.replace(/[^\d.]/g, '')) || 0;
                                  const taxes = parseFloat(formData.buyHoldMonthlyTaxes.replace(/[^\d.]/g, '')) || 0;
                                  const insurance = parseFloat(formData.buyHoldMonthlyInsurance.replace(/[^\d.]/g, '')) || 0;
                                  const other = parseFloat(formData.buyHoldOtherExpenses.replace(/[^\d.]/g, '')) || 0;
                                  const purchase = parseFloat(formData.buyHoldPurchasePrice.replace(/[^\d.]/g, '')) || 0;
                                  const rehab = parseFloat(formData.buyHoldRehabCost.replace(/[^\d.]/g, '')) || 0;
                                  const allIn = purchase + rehab;
                                  const annualCashFlow = (rent - taxes - insurance - other) * 12;
                                  const capRate = allIn > 0 ? (annualCashFlow / allIn) * 100 : 0;
                                  return capRate !== 0 ? `${capRate.toFixed(2)}%` : '0%';
                                })()}
                              </div>
                            </div>
                          </>
                        )}

                        {/* Subject-To Calculations */}
                        {formData.buyHoldType === 'subject-to' && (
                          <>
                            <div>
                              <span className="font-medium text-muted-foreground">PITI:</span>
                              <div className="text-lg font-bold text-orange-600">
                                {(() => {
                                  const mortgage = parseFloat(formData.buyHoldMortgagePayment.replace(/[^\d.]/g, '')) || 0;
                                  const taxes = parseFloat(formData.buyHoldMonthlyTaxes.replace(/[^\d.]/g, '')) || 0;
                                  const insurance = parseFloat(formData.buyHoldMonthlyInsurance.replace(/[^\d.]/g, '')) || 0;
                                  const piti = mortgage + taxes + insurance;
                                  return piti > 0 ? `$${piti.toLocaleString()}` : '$0';
                                })()}
                              </div>
                            </div>
                            
                            <div>
                              <span className="font-medium text-muted-foreground">Cash Flow:</span>
                              <div className="text-lg font-bold text-green-600">
                                {(() => {
                                  const rent = parseFloat(formData.buyHoldMonthlyRent.replace(/[^\d.]/g, '')) || 0;
                                  const mortgage = parseFloat(formData.buyHoldMortgagePayment.replace(/[^\d.]/g, '')) || 0;
                                  const taxes = parseFloat(formData.buyHoldMonthlyTaxes.replace(/[^\d.]/g, '')) || 0;
                                  const insurance = parseFloat(formData.buyHoldMonthlyInsurance.replace(/[^\d.]/g, '')) || 0;
                                  const cashFlow = rent - mortgage - taxes - insurance;
                                  return cashFlow !== 0 ? `$${cashFlow.toLocaleString()}` : '$0';
                                })()}
                              </div>
                            </div>
                            
                            <div>
                              <span className="font-medium text-muted-foreground">Cash-to-Seller:</span>
                              <div className="text-lg font-bold text-purple-600">
                                {(() => {
                                  const cashToSeller = parseFloat(formData.buyHoldCashToSeller.replace(/[^\d.]/g, '')) || 0;
                                  return cashToSeller > 0 ? `$${cashToSeller.toLocaleString()}` : '$0';
                                })()}
                              </div>
                            </div>
                            
                            <div>
                              <span className="font-medium text-muted-foreground">Cash-on-Cash Return:</span>
                              <div className="text-lg font-bold text-blue-600">
                                {(() => {
                                  const rent = parseFloat(formData.buyHoldMonthlyRent.replace(/[^\d.]/g, '')) || 0;
                                  const mortgage = parseFloat(formData.buyHoldMortgagePayment.replace(/[^\d.]/g, '')) || 0;
                                  const taxes = parseFloat(formData.buyHoldMonthlyTaxes.replace(/[^\d.]/g, '')) || 0;
                                  const insurance = parseFloat(formData.buyHoldMonthlyInsurance.replace(/[^\d.]/g, '')) || 0;
                                  const cashToSeller = parseFloat(formData.buyHoldCashToSeller.replace(/[^\d.]/g, '')) || 0;
                                  const annualCashFlow = (rent - mortgage - taxes - insurance) * 12;
                                  const cocReturn = cashToSeller > 0 ? (annualCashFlow / cashToSeller) * 100 : 0;
                                  return cocReturn !== 0 ? `${cocReturn.toFixed(2)}%` : '0%';
                                })()}
                              </div>
                            </div>
                          </>
                        )}
                        
                        {/* 1% Rule Check - Always show but only in listing if toggled on */}
                        <div>
                          <span className="font-medium text-muted-foreground">1% Rule Check:</span>
                          <div className="text-lg font-bold">
                            {(() => {
                              const rent = parseFloat(formData.buyHoldMonthlyRent.replace(/[^\d.]/g, '')) || 0;
                              const basis = formData.buyHoldType === 'standard' ? 
                                (parseFloat(formData.buyHoldPurchasePrice.replace(/[^\d.]/g, '')) || 0) +
                                (parseFloat(formData.buyHoldRehabCost.replace(/[^\d.]/g, '')) || 0) :
                                parseFloat(formData.buyHoldCashToSeller.replace(/[^\d.]/g, '')) || 0;
                              const onePercentRule = basis > 0 ? (rent / basis) * 100 : 0;
                              const passes = onePercentRule >= 1;
                              return (
                                <span className={passes ? 'text-green-600' : 'text-red-600'}>
                                  {onePercentRule > 0 ? `${onePercentRule.toFixed(2)}%` : '0%'} 
                                  {onePercentRule > 0 && (passes ? ' ✓ PASS' : ' ✗ FAIL')}
                                </span>
                              );
                            })()}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
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
                    <div className="flex items-center gap-2">
                      {comp.address && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleCompAttomDataFetch(index)}
                          disabled={isCompAttomFetching[index]}
                          className="flex items-center gap-2"
                        >
                          <Database className="h-4 w-4" />
                          {isCompAttomFetching[index] ? 'Fetching...' : 'Auto-Fill'}
                        </Button>
                      )}
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
                    
                    {/* Residential fields - only show when not land */}
                    {!formData.isLand && (
                      <>
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
                      </>
                    )}
                    
                    <div>
                      <Label>Lot Size {formData.isLand ? '*' : '(Optional)'}</Label>
                      <Input
                        placeholder="0.25 acres or 10,890 sq ft"
                        value={comp.lotSize}
                        onChange={(e) => updateComp(index, 'lotSize', e.target.value)}
                      />
                    </div>
                    
                    {/* Road Frontage - only show for land */}
                    {formData.isLand && (
                      <div>
                        <Label>Road Frontage (Optional)</Label>
                        <div className="flex gap-2">
                          <Input
                            type="number"
                            step="0.1"
                            placeholder="100"
                            value={comp.roadFrontage}
                            onChange={(e) => updateComp(index, 'roadFrontage', e.target.value)}
                            className="flex-1"
                          />
                          <div className="flex items-center space-x-2">
                            <input
                              id={`roadFrontageUnit-ft-${index}`}
                              type="checkbox"
                              checked={comp.roadFrontageUnit === 'ft'}
                              onChange={(e) => updateComp(index, 'roadFrontageUnit', e.target.checked ? 'ft' : 'miles')}
                              className="rounded border border-gray-300"
                            />
                            <Label htmlFor={`roadFrontageUnit-ft-${index}`} className="text-sm">Ft</Label>
                            <input
                              id={`roadFrontageUnit-miles-${index}`}
                              type="checkbox"
                              checked={comp.roadFrontageUnit === 'miles'}
                              onChange={(e) => updateComp(index, 'roadFrontageUnit', e.target.checked ? 'miles' : 'ft')}
                              className="rounded border border-gray-300"
                            />
                            <Label htmlFor={`roadFrontageUnit-miles-${index}`} className="text-sm">Miles</Label>
                          </div>
                        </div>
                      </div>
                    )}
                    
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
                          {/* Remove Listed for Rent option when Is Land is checked */}
                          {!formData.isLand && <SelectItem value="Listed for Rent">Listed for Rent</SelectItem>}
                          <SelectItem value="Off-Market">Off-Market</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label>{formData.isLand ? 'Land Condition' : 'Condition *'}</Label>
                      <Select value={comp.conditionLabel} onValueChange={(value) => updateComp(index, 'conditionLabel', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select condition" />
                        </SelectTrigger>
                        <SelectContent>
                          {formData.isLand ? (
                            <>
                              <SelectItem value="Wooded">Wooded</SelectItem>
                              <SelectItem value="Partially Cleared">Partially Cleared</SelectItem>
                              <SelectItem value="Cleared">Cleared</SelectItem>
                            </>
                          ) : (
                            <>
                              <SelectItem value="Flip Condition">Flip Condition</SelectItem>
                              <SelectItem value="Retail Condition">Retail Condition</SelectItem>
                              <SelectItem value="Move-in Ready">Move-in Ready</SelectItem>
                              <SelectItem value="Needs Work">Needs Work</SelectItem>
                            </>
                          )}
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
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !comp.soldListedDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {comp.soldListedDate ? (() => {
                              const [year, month, day] = comp.soldListedDate.split('-');
                              return format(new Date(parseInt(year), parseInt(month) - 1, parseInt(day)), "MM/dd/yyyy");
                            })() : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={comp.soldListedDate ? (() => {
                              const [year, month, day] = comp.soldListedDate.split('-');
                              return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
                            })() : undefined}
                            onSelect={(date) => {
                              if (date) {
                                const year = date.getFullYear();
                                const month = String(date.getMonth() + 1).padStart(2, '0');
                                const day = String(date.getDate()).padStart(2, '0');
                                updateComp(index, 'soldListedDate', `${year}-${month}-${day}`);
                              } else {
                                updateComp(index, 'soldListedDate', '');
                              }
                            }}
                            initialFocus
                            className="pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    
                    <div>
                      <Label>Pending Date (Optional)</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !comp.pendingDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {comp.pendingDate ? (
                              format(new Date(comp.pendingDate), "MM/dd/yyyy")
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={comp.pendingDate ? new Date(comp.pendingDate) : undefined}
                            onSelect={(date) => updateComp(index, 'pendingDate', date ? date.toISOString() : '')}
                            initialFocus
                            className="pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    {/* Listed Rent Price - only show when not land */}
                    {!formData.isLand && (
                      <div>
                        <Label>Listed Rent Price (Optional)</Label>
                        <Input
                          placeholder="$1,350/mo"
                          value={comp.comments}
                          onChange={(e) => updateComp(index, 'comments', e.target.value)}
                        />
                      </div>
                    )}
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
                  <Label htmlFor="contactEmail">Contact Email <span className="text-destructive">*</span></Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.contactEmail}
                    onChange={(e) => updateFormData('contactEmail', e.target.value)}
                    required
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

              <div className="space-y-2">
                <div className="flex items-center space-x-2 mb-2">
                  <Checkbox
                    id="include_business_hours"
                    checked={formData.includeBusinessHours}
                    onCheckedChange={(checked) => updateFormData('includeBusinessHours', checked as boolean)}
                  />
                  <Label htmlFor="include_business_hours" className="cursor-pointer">
                    Include Business Hours
                  </Label>
                </div>
                
                {formData.includeBusinessHours && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="startTime" className="text-sm font-medium">Start Time</Label>
                      <div className="relative">
                        <Input
                          id="startTime"
                          type="time"
                          placeholder="--:-- --"
                          value={formData.businessHours.startTime || ''}
                          onChange={(e) => updateFormData('businessHours', { ...formData.businessHours, startTime: e.target.value })}
                          className="pr-10"
                        />
                        <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="endTime" className="text-sm font-medium">End Time</Label>
                      <div className="relative">
                        <Input
                          id="endTime"
                          type="time"
                          placeholder="--:-- --"
                          value={formData.businessHours.endTime || ''}
                          onChange={(e) => updateFormData('businessHours', { ...formData.businessHours, endTime: e.target.value })}
                          className="pr-10"
                        />
                        <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="timezone" className="text-sm font-medium">Timezone</Label>
                      <Select 
                        value={formData.businessHours.timeZone || ''} 
                        onValueChange={(value) => updateFormData('businessHours', { ...formData.businessHours, timeZone: value })}
                      >
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
                )}
              </div>

              <div>
                <Label htmlFor="companyLogo">Company Logo (Optional)</Label>
                {existingCompanyLogo && !formData.companyLogo && (
                  <div className="mb-2 p-2 border rounded">
                    <p className="text-sm text-muted-foreground mb-1">Current logo:</p>
                    <img src={existingCompanyLogo} alt="Current logo" className="max-h-32 object-contain" />
                  </div>
                )}
                <Input
                  id="companyLogo"
                  type="file"
                  accept="image/*"
                  onChange={(e) => updateFormData('companyLogo', e.target.files?.[0] || null)}
                />
                {existingCompanyLogo && !formData.companyLogo && (
                  <p className="text-xs text-muted-foreground mt-1">Upload a new logo to replace the current one</p>
                )}
              </div>

              <div>
                <Label htmlFor="contactImage">Personal Headshot (Optional)</Label>
                {existingContactImage && !formData.contactImage && (
                  <div className="mb-2 p-2 border rounded">
                    <p className="text-sm text-muted-foreground mb-1">Current headshot:</p>
                    <img src={existingContactImage} alt="Current contact" className="max-h-32 object-contain" />
                  </div>
                )}
                <Input
                  id="contactImage"
                  type="file"
                  accept="image/*"
                  onChange={(e) => updateFormData('contactImage', e.target.files?.[0] || null)}
                />
                {existingContactImage && !formData.contactImage && (
                  <p className="text-xs text-muted-foreground mt-1">Upload a new photo to replace the current one</p>
                )}
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

              <div>
                <Label htmlFor="postPossession">Post-Possession</Label>
                <Input
                  id="postPossession"
                  placeholder="Available at closing"
                  value={formData.postPossession}
                  onChange={(e) => updateFormData('postPossession', e.target.value)}
                />
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
        onViewProperty={() => window.open(buildAbsoluteShareUrl(shareUrl), '_blank')}
      />
        </div>
      </div>
    </AuthGate>
  );
};

export default Index;