
import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Command as CommandPrimitive } from 'cmdk';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { locations } from '@/constants/locationData';

interface LocationSelectProps {
  value: string;
  onChange: (value: string) => void;
}

const LocationSelect: React.FC<LocationSelectProps> = ({ value, onChange }) => {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="space-y-3">
      <h3 className="font-medium text-lg">Where are you located?</h3>
      <p className="text-sm text-muted-foreground">Please select your U.S. state or international business region</p>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between md:max-w-md"
          >
            {value || "Select location..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full md:max-w-md p-0">
          <CommandPrimitive>
            <CommandPrimitive.Input
              placeholder="Search location..."
              className="h-9 w-full rounded-md border border-input px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
            <CommandPrimitive.List>
              <CommandPrimitive.Empty>No location found.</CommandPrimitive.Empty>
              {locations.map((location) => (
                <CommandPrimitive.Item
                  key={location}
                  value={location}
                  onSelect={(value) => {
                    onChange(value);
                    setOpen(false);
                  }}
                  className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-accent hover:text-accent-foreground"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === location ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {location}
                </CommandPrimitive.Item>
              ))}
            </CommandPrimitive.List>
          </CommandPrimitive>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default LocationSelect;
