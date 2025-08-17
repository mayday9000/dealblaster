import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Download, ArrowLeft, Printer } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Property = () => {
  const [searchParams] = useSearchParams();
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  
  const addressSlug = searchParams.get('address');

  useEffect(() => {
    const fetchProperty = async () => {
      if (!addressSlug) {
        setError('No property address provided');
        setLoading(false);
        return;
      }

      try {
        // Call backend to get pre-rendered HTML
        const response = await fetch(`https://mayday.app.n8n.cloud/webhook-test/dealblaster/property?address=${encodeURIComponent(addressSlug)}`);
        
        if (!response.ok) {
          throw new Error(`Property not found: ${response.status}`);
        }

        const html = await response.text();
        setHtmlContent(html);
      } catch (err) {
        console.error('Error fetching property:', err);
        setError('Property listing not found');
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [addressSlug]);

  const handleDownloadPDF = async () => {
    try {
      // Try API endpoint first
      const pdfResponse = await fetch(`https://mayday.app.n8n.cloud/webhook-test/dealblaster/pdf?address=${encodeURIComponent(addressSlug || '')}`);
      
      if (pdfResponse.ok) {
        const blob = await pdfResponse.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `property-${addressSlug}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        toast({
          title: "PDF Downloaded",
          description: "Property flyer downloaded successfully.",
        });
      } else {
        // Fallback to print
        window.print();
      }
    } catch (error) {
      console.error('PDF download failed, using print fallback:', error);
      window.print();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading property...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="text-center p-6">
            <h1 className="text-xl font-semibold mb-2">Listing Not Found</h1>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button asChild>
              <Link to="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header with controls - hidden on print */}
      <div className="bg-card border-b print:hidden">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="outline" asChild>
              <Link to="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Generator
              </Link>
            </Button>
            
            <Button onClick={handleDownloadPDF} className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Download as PDF
            </Button>
          </div>
        </div>
      </div>

      {/* Property content */}
      <div 
        className="property-content"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
      
      {/* Print styles */}
      <style>{`
        @media print {
          .print\\:hidden {
            display: none !important;
          }
          
          .property-content {
            margin: 0;
            padding: 0;
          }
          
          body {
            margin: 0;
            padding: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default Property;