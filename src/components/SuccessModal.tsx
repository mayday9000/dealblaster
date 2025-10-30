import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Copy, ExternalLink, Check, AlertTriangle } from 'lucide-react';
import { buildAbsoluteShareUrl, isLovablePreviewDomain } from '@/lib/shareLinks';
import { PUBLIC_BASE_URL } from '@/config/app';

interface SuccessModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shareUrl: string;
  onCopyUrl: () => void;
  onViewProperty: () => void;
}

const SuccessModal = ({ open, onOpenChange, shareUrl, onCopyUrl, onViewProperty }: SuccessModalProps) => {
  const fullUrl = buildAbsoluteShareUrl(shareUrl);
  const showPreviewWarning = isLovablePreviewDomain() && !PUBLIC_BASE_URL;

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
          {showPreviewWarning && (
            <Alert variant="default" className="border-amber-500/50 bg-amber-50 dark:bg-amber-950/20">
              <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-500" />
              <AlertDescription className="text-sm text-amber-800 dark:text-amber-200">
                You're copying a preview URL that may require Lovable authentication. 
                Set <code className="px-1 py-0.5 rounded bg-amber-100 dark:bg-amber-900 text-amber-900 dark:text-amber-100">PUBLIC_BASE_URL</code> in{' '}
                <code className="px-1 py-0.5 rounded bg-amber-100 dark:bg-amber-900 text-amber-900 dark:text-amber-100">src/config/app.ts</code> to your published domain for public sharing.
              </AlertDescription>
            </Alert>
          )}
          
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