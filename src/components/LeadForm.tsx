import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface FormData {
  fullName: string;
  phone: string;
  email: string;
}

interface FormErrors {
  fullName?: string;
  phone?: string;
  email?: string;
}

const LeadForm = () => {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    phone: '',
    email: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^[\+]?[\s\-\(\)]?[\d\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Save to Supabase
      const { error: supabaseError } = await supabase
        .from('waitlist_signups')
        .insert({
          name: formData.fullName,
          phone: formData.phone,
          email: formData.email
        });

      if (supabaseError) throw supabaseError;

      // Also post to webhook
      await fetch('https://primary-production-b0d4.up.railway.app/webhook/a9ab59e7-de83-40d0-af55-8434f6364abf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.fullName,
          number: formData.phone,
          email: formData.email
        })
      });

      setIsSubmitted(true);
      toast({
        title: "Success!",
        description: "Thanks for joining the waitlist. We'll be in touch soon!",
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  if (isSubmitted) {
    return (
      <section id="lead-form" className="py-12 bg-black">
        <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 sm:pb-0">
          <div className="bg-gray-900 rounded-2xl shadow-xl p-8 border border-gray-800 text-center">
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-6" />
            <h3 className="text-3xl font-bold text-white mb-4">Thanks! You're on the list.</h3>
            <p className="text-gray-300">We'll reach out soon.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="lead-form" className="py-12 bg-black">
      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 sm:pb-0">
        <div className="bg-gray-900 rounded-2xl shadow-xl p-8 border border-gray-800">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-white mb-2">Join The Waitlist</h3>
            <p className="text-gray-300 font-bold">Be the first to know when DealBlaster launches</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="fullName" className="text-white font-medium text-lg mb-2 block">Full Name *</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                className={`rounded-xl bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 ${errors.fullName ? 'border-red-500' : ''}`}
                disabled={isSubmitting}
              />
              {errors.fullName && (
                <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
              )}
            </div>

            <div>
              <Label htmlFor="phone" className="text-white font-medium text-lg mb-2 block">Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="(555) 123-4567"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className={`rounded-xl bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 ${errors.phone ? 'border-red-500' : ''}`}
                disabled={isSubmitting}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
              )}
            </div>

            <div>
              <Label htmlFor="email" className="text-white font-medium text-lg mb-2 block">Email Address *</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`rounded-xl bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 ${errors.email ? 'border-red-500' : ''}`}
                disabled={isSubmitting}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <Button 
              type="submit"
              className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold py-6 text-lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Notifying...' : 'Notify Me'}
            </Button>

            <p className="text-sm text-gray-400 text-center">
              We'll only use your info to contact you about DealBlaster.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};

export default LeadForm;
