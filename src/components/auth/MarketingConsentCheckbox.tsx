
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface MarketingConsentCheckboxProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

const MarketingConsentCheckbox = ({ checked, onCheckedChange }: MarketingConsentCheckboxProps) => {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox 
        id="marketing-consent" 
        checked={checked} 
        onCheckedChange={(checked) => onCheckedChange(checked === true)}
      />
      <Label htmlFor="marketing-consent" className="text-sm text-muted-foreground">
        Add me to the mailing list for product updates and marketing information. Your personal information will not be shared.
      </Label>
    </div>
  );
};

export default MarketingConsentCheckbox;
