
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';

interface SyncDialogProps {
  open: boolean;
  onClose: () => void;
  status: 'idle' | 'syncing' | 'success' | 'error';
  onConfirm: () => void;
  onCancel: () => void;
}

const SyncDialog: React.FC<SyncDialogProps> = ({
  open,
  onClose,
  status,
  onConfirm,
  onCancel
}) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sync Local Data to Cloud Storage</DialogTitle>
          <DialogDescription>
            Would you like to sync your existing local data to cloud storage?
            This allows your assessments to be sent to Google Sheets and accessed from any device.
          </DialogDescription>
        </DialogHeader>
        
        {status === 'syncing' ? (
          <div className="py-6 flex flex-col items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p>Syncing your data to the cloud...</p>
          </div>
        ) : status === 'success' ? (
          <div className="py-6 text-center text-green-600">
            <p className="font-medium">Sync completed successfully!</p>
            <p className="text-sm text-muted-foreground mt-2">
              Your data is now available in cloud storage and Google Sheets integration is active.
            </p>
          </div>
        ) : status === 'error' ? (
          <div className="py-6 text-center text-red-600">
            <p className="font-medium">Sync failed</p>
            <p className="text-sm text-muted-foreground mt-2">
              There was an error syncing your data. Please try again.
            </p>
          </div>
        ) : (
          <div className="py-4">
            <p className="mb-2">This will copy your:</p>
            <ul className="list-disc pl-6 mb-4 text-sm">
              <li>Assessment results and history</li>
              <li>User profile information</li>
              <li>Organization information (if any)</li>
            </ul>
            <p className="text-sm text-muted-foreground">
              Enabling cloud storage will also activate Google Sheets integration, sending your
              assessment data to a central spreadsheet.
            </p>
          </div>
        )}
        
        {status === 'idle' && (
          <DialogFooter>
            <Button variant="outline" onClick={onCancel}>Cancel</Button>
            <Button onClick={onConfirm}>Sync Now</Button>
          </DialogFooter>
        )}
        
        {(status === 'success' || status === 'error') && (
          <DialogFooter>
            <Button onClick={onClose}>Close</Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SyncDialog;
