import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { User, Phone, Mail, Building, Clock, Globe, Upload, Image as ImageIcon } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { AuthGate } from '@/components/AuthGate';
import { Header } from '@/components/Header';
import { useSession } from '@/hooks/useSession';

interface UserProfile {
  contact_name: string;
  contact_phone: string;
  contact_email: string;
  office_number: string;
  website: string;
  business_hours: {
    startTime: string;
    endTime: string;
    timeZone: string;
  };
  company_logo: string | null;
  contact_image: string | null;
}

const ContactInfo = () => {
  const { user } = useSession();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profileData, setProfileData] = useState<UserProfile>({
    contact_name: '',
    contact_phone: '',
    contact_email: '',
    office_number: '',
    website: '',
    business_hours: {
      startTime: '09:00',
      endTime: '17:00',
      timeZone: 'EST'
    },
    company_logo: null,
    contact_image: null
  });
  const [companyLogoFile, setCompanyLogoFile] = useState<File | null>(null);
  const [contactImageFile, setContactImageFile] = useState<File | null>(null);
  const [companyLogoPreview, setCompanyLogoPreview] = useState<string | null>(null);
  const [contactImagePreview, setContactImagePreview] = useState<string | null>(null);
  const [includeBusinessHours, setIncludeBusinessHours] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        const businessHours = data.business_hours as { startTime: string; endTime: string; timeZone: string } | null;
        setProfileData({
          contact_name: data.contact_name || '',
          contact_phone: data.contact_phone || '',
          contact_email: data.contact_email || '',
          office_number: data.office_number || '',
          website: data.website || '',
          business_hours: businessHours || { startTime: '09:00', endTime: '17:00', timeZone: 'EST' },
          company_logo: data.company_logo || null,
          contact_image: data.contact_image || null
        });
        setCompanyLogoPreview(data.company_logo);
        setContactImagePreview(data.contact_image);
        setIncludeBusinessHours(businessHours !== null && businessHours.startTime !== '');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Error",
        description: "Failed to load profile data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const uploadImage = async (file: File, folder: string): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${user!.id}/${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('profile-images')
      .upload(filePath, file, { upsert: true });

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('profile-images')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleSave = async () => {
    if (!user) return;

    // Validate email is required
    if (!profileData.contact_email || !profileData.contact_email.trim()) {
      toast({
        title: "Validation Error",
        description: "Email is required",
        variant: "destructive"
      });
      return;
    }

    setSaving(true);
    try {
      let companyLogoUrl = profileData.company_logo;
      let contactImageUrl = profileData.contact_image;

      // Upload new images if selected
      if (companyLogoFile) {
        companyLogoUrl = await uploadImage(companyLogoFile, 'company-logos');
      }
      if (contactImageFile) {
        contactImageUrl = await uploadImage(contactImageFile, 'contact-images');
      }

      const { error } = await supabase
        .from('user_profiles')
        .upsert({
          user_id: user.id,
          contact_name: profileData.contact_name || null,
          contact_phone: profileData.contact_phone || null,
          contact_email: profileData.contact_email || null,
          office_number: profileData.office_number || null,
          website: profileData.website || null,
          business_hours: includeBusinessHours ? profileData.business_hours : null,
          company_logo: companyLogoUrl,
          contact_image: contactImageUrl
        }, {
          onConflict: 'user_id'
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Contact information saved successfully"
      });

      // Refresh profile data
      fetchProfile();
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: "Error",
        description: "Failed to save contact information",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'image') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === 'logo') {
      setCompanyLogoFile(file);
      setCompanyLogoPreview(URL.createObjectURL(file));
    } else {
      setContactImageFile(file);
      setContactImagePreview(URL.createObjectURL(file));
    }
  };

  const timezones = ['EST', 'CST', 'MST', 'PST', 'AKST', 'HST'];

  if (loading) {
    return (
      <AuthGate>
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AuthGate>
    );
  }

  return (
    <AuthGate>
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-6 w-6" />
              Contact Information
            </CardTitle>
            <CardDescription>
              Set up your default contact information. This will auto-populate when creating new property flyers.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <User className="h-5 w-5" />
                Basic Information
              </h3>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="contact_name">Name</Label>
                  <Input
                    id="contact_name"
                    value={profileData.contact_name}
                    onChange={(e) => setProfileData({ ...profileData, contact_name: e.target.value })}
                    placeholder="John Doe"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact_phone">Phone Number</Label>
                  <Input
                    id="contact_phone"
                    value={profileData.contact_phone}
                    onChange={(e) => setProfileData({ ...profileData, contact_phone: e.target.value })}
                    placeholder="(555) 123-4567"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact_email">Email <span className="text-destructive">*</span></Label>
                  <Input
                    id="contact_email"
                    type="email"
                    value={profileData.contact_email}
                    onChange={(e) => setProfileData({ ...profileData, contact_email: e.target.value })}
                    placeholder="john@example.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="office_number">Office Number</Label>
                  <Input
                    id="office_number"
                    value={profileData.office_number}
                    onChange={(e) => setProfileData({ ...profileData, office_number: e.target.value })}
                    placeholder="(555) 987-6543"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={profileData.website}
                    onChange={(e) => setProfileData({ ...profileData, website: e.target.value })}
                    placeholder="https://example.com"
                  />
                </div>
              </div>
            </div>

            {/* Business Hours */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Business Hours
              </h3>
              
              <div className="flex items-center space-x-2 mb-4">
                <Checkbox
                  id="include_business_hours"
                  checked={includeBusinessHours}
                  onCheckedChange={(checked) => setIncludeBusinessHours(checked as boolean)}
                />
                <Label htmlFor="include_business_hours" className="cursor-pointer">
                  Include Business Hours
                </Label>
              </div>
              
              {includeBusinessHours && (
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="start_time">Start Time</Label>
                    <Input
                      id="start_time"
                      type="time"
                      value={profileData.business_hours.startTime}
                      onChange={(e) => setProfileData({
                        ...profileData,
                        business_hours: { ...profileData.business_hours, startTime: e.target.value }
                      })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="end_time">End Time</Label>
                    <Input
                      id="end_time"
                      type="time"
                      value={profileData.business_hours.endTime}
                      onChange={(e) => setProfileData({
                        ...profileData,
                        business_hours: { ...profileData.business_hours, endTime: e.target.value }
                      })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select
                      value={profileData.business_hours.timeZone}
                      onValueChange={(value) => setProfileData({
                        ...profileData,
                        business_hours: { ...profileData.business_hours, timeZone: value }
                      })}
                    >
                      <SelectTrigger id="timezone">
                        <SelectValue placeholder="Select timezone" />
                      </SelectTrigger>
                      <SelectContent>
                        {timezones.map((tz) => (
                          <SelectItem key={tz} value={tz}>{tz}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </div>

            {/* Images */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Images
              </h3>
              
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="company_logo">Company Logo</Label>
                  <div className="space-y-3">
                    {companyLogoPreview && (
                      <div className="relative w-full h-32 rounded-lg border overflow-hidden bg-muted">
                        <img
                          src={companyLogoPreview}
                          alt="Company Logo"
                          className="w-full h-full object-contain p-2"
                        />
                      </div>
                    )}
                    <Input
                      id="company_logo"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, 'logo')}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact_image">Personal Headshot</Label>
                  <div className="space-y-3">
                    {contactImagePreview && (
                      <div className="relative w-full h-32 rounded-lg border overflow-hidden bg-muted">
                        <img
                          src={contactImagePreview}
                          alt="Contact"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <Input
                      id="contact_image"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, 'image')}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4">
              <Button
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Contact Information'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AuthGate>
  );
};

export default ContactInfo;
