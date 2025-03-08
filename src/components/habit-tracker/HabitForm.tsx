
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Save, X } from 'lucide-react';
import { HEARTIDimension } from '@/types';
import { NewHabitForm } from '@/hooks/useHabits';

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
  return (
    <Card className="mb-6 border border-dashed">
      <CardContent className="pt-6">
        <div className="grid gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="habit-dimension">Dimension</Label>
              <select
                id="habit-dimension"
                value={newHabit.dimension}
                onChange={(e) => onHabitChange({ dimension: e.target.value as HEARTIDimension })}
                className="w-full mt-1 p-2 border rounded-md"
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
              <Label htmlFor="habit-frequency">Frequency</Label>
              <select
                id="habit-frequency"
                value={newHabit.frequency}
                onChange={(e) => onHabitChange({ frequency: e.target.value as 'daily' | 'weekly' })}
                className="w-full mt-1 p-2 border rounded-md"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
              </select>
            </div>
          </div>
          
          <div>
            <Label htmlFor="habit-description">Description</Label>
            <Input
              id="habit-description"
              value={newHabit.description}
              onChange={(e) => onHabitChange({ description: e.target.value })}
              placeholder="e.g., Practice active listening for 10 minutes"
              className="mt-1"
            />
          </div>
          
          <Button onClick={onSave} className="w-full mt-2">
            <Save size={16} className="mr-2" />
            Save Habit
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default HabitForm;
