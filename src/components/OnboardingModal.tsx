import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useSession } from '@/hooks/useSession';

export function OnboardingModal() {
  const { user } = useSession();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    contact_name: '',
    contact_phone: '',
    contact_email: '',
    office_number: '',
    website: '',
    business_hours: {
      startTime: '09:00',
      endTime: '17:00',
      timeZone: 'EST'
    }
  });

  useEffect(() => {
    checkIfProfileExists();
  }, [user]);

  const checkIfProfileExists = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      // Show modal only if no profile exists
      if (!data && !error) {
        setOpen(true);
      }
    } catch (error) {
      console.error('Error checking profile:', error);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('user_profiles')
        .insert({
          user_id: user.id,
          contact_name: formData.contact_name || null,
          contact_phone: formData.contact_phone || null,
          contact_email: formData.contact_email || null,
          office_number: formData.office_number || null,
          website: formData.website || null,
          business_hours: formData.business_hours,
          company_logo: null,
          contact_image: null
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Contact information saved! You can update it anytime from the Contact Info page."
      });

      setOpen(false);
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

  const handleSkip = () => {
    // Create an empty profile to mark onboarding as completed
    if (!user) return;

    supabase
      .from('user_profiles')
      .insert({
        user_id: user.id,
        contact_name: null,
        contact_phone: null,
        contact_email: null,
        office_number: null,
        website: null,
        business_hours: { startTime: '09:00', endTime: '17:00', timeZone: 'EST' },
        company_logo: null,
        contact_image: null
      })
      .then(() => {
        setOpen(false);
      });
  };

  const timezones = ['EST', 'CST', 'MST', 'PST', 'AKST', 'HST'];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-6 w-6" />
            Welcome! Set Up Your Contact Information
          </DialogTitle>
          <DialogDescription>
            Set up your default contact information to save time when creating property flyers. All fields are optional.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="onboard_name">Name</Label>
              <Input
                id="onboard_name"
                value={formData.contact_name}
                onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
                placeholder="John Doe"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="onboard_phone">Phone Number</Label>
              <Input
                id="onboard_phone"
                value={formData.contact_phone}
                onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                placeholder="(555) 123-4567"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="onboard_email">Email</Label>
              <Input
                id="onboard_email"
                type="email"
                value={formData.contact_email}
                onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                placeholder="john@example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="onboard_office">Office Number</Label>
              <Input
                id="onboard_office"
                value={formData.office_number}
                onChange={(e) => setFormData({ ...formData, office_number: e.target.value })}
                placeholder="(555) 987-6543"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="onboard_website">Website</Label>
              <Input
                id="onboard_website"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                placeholder="https://example.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-base font-semibold">Business Hours (Optional)</Label>
            <div className="grid gap-3 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="onboard_start_time" className="text-sm">Start Time</Label>
                <Input
                  id="onboard_start_time"
                  type="time"
                  value={formData.business_hours.startTime}
                  onChange={(e) => setFormData({
                    ...formData,
                    business_hours: { ...formData.business_hours, startTime: e.target.value }
                  })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="onboard_end_time" className="text-sm">End Time</Label>
                <Input
                  id="onboard_end_time"
                  type="time"
                  value={formData.business_hours.endTime}
                  onChange={(e) => setFormData({
                    ...formData,
                    business_hours: { ...formData.business_hours, endTime: e.target.value }
                  })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="onboard_timezone" className="text-sm">Timezone</Label>
                <Select
                  value={formData.business_hours.timeZone}
                  onValueChange={(value) => setFormData({
                    ...formData,
                    business_hours: { ...formData.business_hours, timeZone: value }
                  })}
                >
                  <SelectTrigger id="onboard_timezone">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {timezones.map((tz) => (
                      <SelectItem key={tz} value={tz}>{tz}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={handleSkip} disabled={saving}>
            Skip for now
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save & Continue'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
