
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Save, X } from 'lucide-react';
import { HEARTIDimension } from '@/types';
import { NewHabitForm } from '@/hooks/useHabits';
import { useIsMobile } from '@/hooks/use-mobile';

interface HabitFormProps {
  newHabit: NewHabitForm;
  onCancel: () => void;
  onSave: () => void;
  onHabitChange: (value: Partial<NewHabitForm>) => void;
}

const HabitForm: React.FC<HabitFormProps> = ({
  newHabit,
  onCancel,
  onSave,
  onHabitChange
}) => {
  const isMobile = useIsMobile();
  
  return (
    <Card className="mb-6 border bg-white shadow-sm rounded-xl">
      <CardContent className={`${isMobile ? 'pt-4 px-3' : 'pt-6'}`}>
        <div className="grid gap-4">
          <div className={`grid ${isMobile ? 'grid-cols-1 gap-3' : 'grid-cols-1 md:grid-cols-2 gap-4'}`}>
            <div>
              <Label htmlFor="habit-dimension" className="text-sm font-medium mb-1.5">Dimension</Label>
              <select
                id="habit-dimension"
                value={newHabit.dimension}
                onChange={(e) => onHabitChange({ dimension: e.target.value as HEARTIDimension })}
                className="w-full p-2.5 rounded-lg border border-gray-200 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              >
                <option value="humility">Humility</option>
                <option value="empathy">Empathy</option>
                <option value="accountability">Accountability</option>
                <option value="resiliency">Resiliency</option>
                <option value="transparency">Transparency</option>
                <option value="inclusivity">Inclusivity</option>
              </select>
            </div>
            
            <div>
              <Label htmlFor="habit-frequency" className="text-sm font-medium mb-1.5">Frequency</Label>
              <select
                id="habit-frequency"
                value={newHabit.frequency}
                onChange={(e) => onHabitChange({ frequency: e.target.value as 'daily' | 'weekly' })}
                className="w-full p-2.5 rounded-lg border border-gray-200 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
              </select>
            </div>
          </div>
          
          <div>
            <Label htmlFor="habit-description" className="text-sm font-medium mb-1.5">Description</Label>
            <Input
              id="habit-description"
              value={newHabit.description}
              onChange={(e) => onHabitChange({ description: e.target.value })}
              placeholder="e.g., Practice active listening for 10 minutes"
              className="p-2.5 rounded-lg border border-gray-200 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          
          <div className={`flex ${isMobile ? 'flex-col gap-2' : 'flex-row gap-3'} mt-2`}>
            <Button 
              onClick={onSave} 
              className={`${isMobile ? 'w-full' : 'flex-1'} bg-indigo-600 hover:bg-indigo-700 text-white`}
            >
              <Save size={16} className="mr-2" />
              Save Habit
            </Button>
            {isMobile && (
              <Button 
                onClick={onCancel} 
                variant="outline" 
                className="w-full"
              >
                <X size={16} className="mr-2" />
                Cancel
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HabitForm;
