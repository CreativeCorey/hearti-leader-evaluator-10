
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
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);

  // Focus input when popover opens
  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } else {
      // Reset search when closed
      setSearchQuery('');
      setFocusedIndex(-1);
    }
  }, [open]);

  // Filter locations based on search query
  const filteredLocations = searchQuery.trim() === '' 
    ? [] // Don't show any results when search is empty to avoid overwhelming the user
    : locations.filter(loc => 
        loc.toLowerCase().includes(searchQuery.toLowerCase())
      );

  // Handle keyboard events for accessibility
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && filteredLocations.length > 0 && focusedIndex >= 0) {
      // Select the focused item when Enter is pressed
      onChange(filteredLocations[focusedIndex]);
      setOpen(false);
      e.preventDefault();
    } else if (e.key === 'ArrowDown') {
      // Move focus down
      setFocusedIndex(prev => 
        prev < filteredLocations.length - 1 ? prev + 1 : prev
      );
      e.preventDefault();
    } else if (e.key === 'ArrowUp') {
      // Move focus up
      setFocusedIndex(prev => prev > 0 ? prev - 1 : 0);
      e.preventDefault();
    }
  };

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
            className="w-full justify-between h-12 text-base"
          >
            {value || "Select location..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-full p-0" 
          align="start" 
          sideOffset={5} 
          side={isMobile ? "bottom" : "right"} 
          alignOffset={0}
          style={{ width: isMobile ? "calc(100vw - 32px)" : "320px", maxWidth: "100%" }}
        >
          <CommandPrimitive 
            className={`${isMobile ? "max-h-[40vh]" : "max-h-[50vh]"} overflow-auto`}
            onKeyDown={handleKeyDown}
          >
            <div className="flex items-center border-b px-3">
              <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
              <CommandPrimitive.Input
                ref={inputRef}
                placeholder="Search location..."
                className="h-12 w-full border-0 bg-transparent outline-none placeholder:text-muted-foreground flex-1 text-base"
                value={searchQuery}
                onValueChange={setSearchQuery}
              />
            </div>
            <CommandPrimitive.List className="p-2">
              <CommandPrimitive.Empty className="py-6 text-center">No location found.</CommandPrimitive.Empty>
              
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
                        isMobile={isMobile}
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
                        isMobile={isMobile}
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
              
              {searchQuery.trim() !== '' && filteredLocations.map((location, index) => (
                <LocationItem
                  key={location}
                  location={location}
                  selected={value === location}
                  focused={index === focusedIndex}
                  onSelect={() => {
                    onChange(location);
                    setOpen(false);
                  }}
                  onFocus={() => setFocusedIndex(index)}
                  searchQuery={searchQuery}
                  isMobile={isMobile}
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
  focused?: boolean;
  onSelect: () => void;
  onFocus?: () => void;
  searchQuery?: string;
  isMobile?: boolean;
}

const LocationItem: React.FC<LocationItemProps> = ({ 
  location, 
  selected, 
  focused,
  onSelect,
  onFocus,
  searchQuery,
  isMobile
}) => {
  // Standard item without search highlighting
  if (!searchQuery) {
    return (
      <CommandPrimitive.Item
        key={location}
        value={location}
        onSelect={() => onSelect()}
        onFocus={onFocus}
        data-focused={focused}
        className={cn(
          `relative flex cursor-default select-none items-center rounded-sm px-3 py-3 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-accent hover:text-accent-foreground ${isMobile ? 'text-base' : ''}`,
          focused && "bg-accent text-accent-foreground"
        )}
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
      onFocus={onFocus}
      data-focused={focused}
      className={cn(
        `relative flex cursor-default select-none items-center rounded-sm px-3 py-3 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-accent hover:text-accent-foreground ${isMobile ? 'text-base' : ''}`,
        focused && "bg-accent text-accent-foreground"
      )}
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
