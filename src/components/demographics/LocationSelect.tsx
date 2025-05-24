
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

  // Handle location selection
  const handleLocationSelect = (location: string) => {
    onChange(location);
    setOpen(false);
    setSearchQuery('');
    setFocusedIndex(-1);
  };

  // Handle keyboard events for accessibility
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && filteredLocations.length > 0) {
      e.preventDefault();
      if (focusedIndex >= 0 && focusedIndex < filteredLocations.length) {
        // Select the focused item when Enter is pressed
        handleLocationSelect(filteredLocations[focusedIndex]);
      } else if (filteredLocations.length === 1) {
        // If only one result, select it
        handleLocationSelect(filteredLocations[0]);
      }
    } else if (e.key === 'ArrowDown') {
      // Move focus down
      setFocusedIndex(prev => 
        prev < filteredLocations.length - 1 ? prev + 1 : 0
      );
      e.preventDefault();
    } else if (e.key === 'ArrowUp') {
      // Move focus up
      setFocusedIndex(prev => prev > 0 ? prev - 1 : filteredLocations.length - 1);
      e.preventDefault();
    } else if (e.key === 'Escape') {
      setOpen(false);
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
          className="w-full p-0 z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700" 
          align="start" 
          sideOffset={5} 
          side="bottom"
          alignOffset={0}
          avoidCollisions={true}
          style={{ 
            width: "var(--radix-popover-trigger-width)",
            maxWidth: isMobile ? "calc(100vw - 32px)" : "400px",
            maxHeight: isMobile ? "40vh" : "50vh"
          }}
        >
          <CommandPrimitive 
            className="overflow-auto"
            onKeyDown={handleKeyDown}
          >
            <div className="flex items-center border-b px-3 bg-white dark:bg-gray-800">
              <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
              <CommandPrimitive.Input
                ref={inputRef}
                placeholder="Search location..."
                className="h-12 w-full border-0 bg-transparent outline-none placeholder:text-muted-foreground flex-1 text-base"
                value={searchQuery}
                onValueChange={setSearchQuery}
              />
            </div>
            <CommandPrimitive.List className="p-2 bg-white dark:bg-gray-800">
              <CommandPrimitive.Empty className="py-6 text-center">No location found.</CommandPrimitive.Empty>
              
              {searchQuery.trim() === '' && (
                <>
                  <CommandPrimitive.Group heading="United States">
                    {usLocations.slice(0, 5).map((location) => (
                      <LocationItem
                        key={location}
                        location={location}
                        selected={value === location}
                        onSelect={() => handleLocationSelect(location)}
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
                        onSelect={() => handleLocationSelect(location)}
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
                  onSelect={() => handleLocationSelect(location)}
                  onMouseEnter={() => setFocusedIndex(index)}
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
  onMouseEnter?: () => void;
  searchQuery?: string;
  isMobile?: boolean;
}

const LocationItem: React.FC<LocationItemProps> = ({ 
  location, 
  selected, 
  focused,
  onSelect,
  onMouseEnter,
  searchQuery,
  isMobile
}) => {
  // Standard item without search highlighting
  if (!searchQuery) {
    return (
      <CommandPrimitive.Item
        key={location}
        value={location}
        onSelect={onSelect}
        onMouseEnter={onMouseEnter}
        className={cn(
          `relative flex cursor-pointer select-none items-center rounded-sm px-3 py-3 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground ${isMobile ? 'text-base' : ''}`,
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
      onSelect={onSelect}
      onMouseEnter={onMouseEnter}
      className={cn(
        `relative flex cursor-pointer select-none items-center rounded-sm px-3 py-3 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground ${isMobile ? 'text-base' : ''}`,
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
      <span className="bg-yellow-200 dark:bg-yellow-600 text-black dark:text-white font-medium">{match}</span>
      {afterMatch}
    </CommandPrimitive.Item>
  );
};

export default LocationSelect;
