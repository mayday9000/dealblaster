import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Copy, ExternalLink, Check } from 'lucide-react';
import { buildPropertyShareUrl, isLovablePreviewDomain } from '@/lib/shareLinks';

interface SuccessModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shareUrl: string;
  onCopyUrl: () => void;
  onViewProperty: () => void;
}

const SuccessModal = ({ open, onOpenChange, shareUrl, onCopyUrl, onViewProperty }: SuccessModalProps) => {
  // shareUrl is now the address slug, build the property share URL with meta tags
  const fullUrl = buildPropertyShareUrl(shareUrl);
  const showPreviewWarning = false; // No longer needed as edge function handles this

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Check className="w-5 h-5 text-green-600" />
            Property Flyer Created!
          </DialogTitle>
          <DialogDescription>
            Your property flyer has been generated and saved. Share the link below with potential buyers.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="shareUrl">Shareable Link</Label>
            <div className="flex gap-2 mt-1">
              <Input
                id="shareUrl"
                value={fullUrl}
                readOnly
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={onCopyUrl}
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button
              onClick={onViewProperty}
              className="flex-1"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              View Property Page
            </Button>
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Create Another
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SuccessModal;