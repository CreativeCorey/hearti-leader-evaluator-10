
import React, { useState, useRef, useEffect } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Command as CommandPrimitive } from 'cmdk';
import { Check, ChevronsUpDown, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { locations, getGroupedLocations } from '@/constants/locationData';
import { useIsMobile } from '@/hooks/use-mobile';

interface LocationSelectProps {
  value: string;
  onChange: (value: string) => void;
}

const LocationSelect: React.FC<LocationSelectProps> = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const { usLocations, otherLocations } = getGroupedLocations();
  const isMobile = useIsMobile();

  // Focus input when popover opens
  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [open]);

  // Filter locations based on search query
  const filteredLocations = searchQuery.trim() === '' 
    ? [] // Don't show any results when search is empty to avoid overwhelming the user
    : locations.filter(loc => 
        loc.toLowerCase().includes(searchQuery.toLowerCase())
      );

  return (
    <div className="space-y-3 w-full">
      <h3 className="font-medium text-lg">Where are you located?</h3>
      <p className="text-sm text-muted-foreground">Please select your country or U.S. state</p>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {value || "Select location..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start" sideOffset={5} side={isMobile ? "bottom" : "right"} alignOffset={0}>
          <CommandPrimitive className="max-h-[50vh] overflow-auto">
            <div className="flex items-center border-b px-3">
              <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
              <CommandPrimitive.Input
                ref={inputRef}
                placeholder="Search location..."
                className="h-10 w-full border-0 bg-transparent outline-none placeholder:text-muted-foreground flex-1"
                value={searchQuery}
                onValueChange={setSearchQuery}
              />
            </div>
            <CommandPrimitive.List>
              <CommandPrimitive.Empty>No location found.</CommandPrimitive.Empty>
              
              {searchQuery.trim() === '' && (
                <>
                  <CommandPrimitive.Group heading="United States">
                    {usLocations.slice(0, 5).map((location) => (
                      <LocationItem
                        key={location}
                        location={location}
                        selected={value === location}
                        onSelect={() => {
                          onChange(location);
                          setOpen(false);
                        }}
                      />
                    ))}
                    {usLocations.length > 5 && (
                      <div className="px-2 py-1.5 text-sm text-muted-foreground">
                        Type to search all {usLocations.length} US states and territories
                      </div>
                    )}
                  </CommandPrimitive.Group>
                  
                  <CommandPrimitive.Group heading="Other Countries">
                    {otherLocations.slice(0, 5).map((location) => (
                      <LocationItem
                        key={location}
                        location={location}
                        selected={value === location}
                        onSelect={() => {
                          onChange(location);
                          setOpen(false);
                        }}
                      />
                    ))}
                    {otherLocations.length > 5 && (
                      <div className="px-2 py-1.5 text-sm text-muted-foreground">
                        Type to search all {otherLocations.length} countries
                      </div>
                    )}
                  </CommandPrimitive.Group>
                </>
              )}
              
              {searchQuery.trim() !== '' && filteredLocations.map((location) => (
                <LocationItem
                  key={location}
                  location={location}
                  selected={value === location}
                  onSelect={() => {
                    onChange(location);
                    setOpen(false);
                  }}
                  searchQuery={searchQuery}
                />
              ))}
            </CommandPrimitive.List>
          </CommandPrimitive>
        </PopoverContent>
      </Popover>
    </div>
  );
};

interface LocationItemProps {
  location: string;
  selected: boolean;
  onSelect: () => void;
  searchQuery?: string;
}

const LocationItem: React.FC<LocationItemProps> = ({ 
  location, 
  selected, 
  onSelect,
  searchQuery
}) => {
  // Highlight matching text if search query is provided
  if (!searchQuery) {
    return (
      <CommandPrimitive.Item
        key={location}
        value={location}
        onSelect={() => onSelect()}
        className="relative flex cursor-default select-none items-center rounded-sm px-2 py-3 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-accent hover:text-accent-foreground"
      >
        <Check
          className={cn(
            "mr-2 h-4 w-4",
            selected ? "opacity-100" : "opacity-0"
          )}
        />
        {location}
      </CommandPrimitive.Item>
    );
  }
  
  // With search highlighting
  const index = location.toLowerCase().indexOf(searchQuery.toLowerCase());
  if (index === -1) return null;
  
  const beforeMatch = location.substring(0, index);
  const match = location.substring(index, index + searchQuery.length);
  const afterMatch = location.substring(index + searchQuery.length);
  
  return (
    <CommandPrimitive.Item
      key={location}
      value={location}
      onSelect={() => onSelect()}
      className="relative flex cursor-default select-none items-center rounded-sm px-2 py-3 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-accent hover:text-accent-foreground"
    >
      <Check
        className={cn(
          "mr-2 h-4 w-4",
          selected ? "opacity-100" : "opacity-0"
        )}
      />
      {beforeMatch}
      <span className="bg-yellow-200 text-black font-medium">{match}</span>
      {afterMatch}
    </CommandPrimitive.Item>
  );
};

export default LocationSelect;
