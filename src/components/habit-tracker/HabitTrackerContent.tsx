
import React, { useState, useEffect } from 'react';
import { useHabitTracker } from '@/contexts/HabitTrackerContext';
import { HEARTIDimension } from '@/types';
import HabitList from './HabitList';
import HabitForm from './HabitForm';
import LoadingSpinner from './LoadingSpinner';
import EmptyHabitState from './EmptyHabitState';
import TodayHeader from './TodayHeader';
import SavedHabitsView from './SavedHabitsView';
import { useLanguage } from '@/contexts/language/LanguageContext';
import { useHabitForm } from '@/hooks/useHabitForm';
import { completionGoals } from '@/constants/habitGoals';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { CalendarDays, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

interface HabitTrackerContentProps {
  onRefreshAssessments?: () => void;
}

const HabitTrackerContent: React.FC<HabitTrackerContentProps> = ({ onRefreshAssessments }) => {
  const { 
    habits, 
    loading, 
    filteredHabits, 
    weekDates, 
    toggleHabitCompletion, 
    deleteHabit,
    handleAddHabit,
    activeDimension,
    setActiveDimension
  } = useHabitTracker();
  
  const [activeTab, setActiveTab] = useState<string>("all");
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  
  const {
    newHabit,
    addingHabit,
    setAddingHabit,
    resetForm,
    updateHabit
  } = useHabitForm();
  
  // Calculate streaks for a habit
  const calculateStreaks = (habit: any) => {
    // For now, return a placeholder value
    return habit.completedDates?.length || 0;
  };

  const handleSaveHabit = async () => {
    const success = await handleAddHabit(newHabit);
    if (success) {
      resetForm(activeDimension);
      setActiveTab("all");
      setAddingHabit(false);
      
      // Call the refresh function if provided
      if (onRefreshAssessments) {
        onRefreshAssessments();
      }
    }
  };
  
  return (
    <div className="relative">
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className={`${isMobile ? 'mb-3 px-1' : 'mb-6'} flex justify-between items-center`}>
            <h3 className={`${isMobile ? 'text-base' : 'text-lg'} font-medium text-blue flex items-center gap-2`}>
              <CalendarDays size={isMobile ? 18 : 20} className="text-blue-600" />
              {t('results.habits.yourHabits')}
            </h3>
            
            {!addingHabit ? (
              <Button 
                onClick={() => {
                  setAddingHabit(true);
                  setActiveTab("add");
                }} 
                variant="outline" 
                size={isMobile ? "sm" : "sm"}
                className={`rounded-full flex items-center gap-1.5 border-green text-green hover:bg-green/10 ${isMobile ? 'text-xs py-1 h-7 px-2.5' : ''}`}
              >
                <Plus size={isMobile ? 14 : 16} />
                {isMobile ? t('results.habits.add') : t('results.habits.addHabit')}
              </Button>
            ) : (
              <Button 
                onClick={() => {
                  setAddingHabit(false);
                  setActiveTab("all");
                }} 
                variant="outline" 
                size={isMobile ? "sm" : "sm"}
                className={`rounded-full flex items-center gap-1.5 border-red text-red hover:bg-red/10 ${isMobile ? 'text-xs py-1 h-7 px-2.5' : ''}`}
              >
                <X size={isMobile ? 14 : 16} />
                {t('results.habits.cancel')}
              </Button>
            )}
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsContent value="all" className="mt-2">
              <TodayHeader />
              
              {filteredHabits.length === 0 ? (
                <EmptyHabitState />
              ) : (
                <HabitList 
                  habits={filteredHabits}
                  weekDates={weekDates}
                  onToggleHabit={toggleHabitCompletion}
                  onDeleteHabit={deleteHabit}
                  calculateStreaks={calculateStreaks}
                  completionTargets={completionGoals}
                  onDelete={deleteHabit} // Added for compatibility
                />
              )}
            </TabsContent>
            
            <TabsContent value="add" className="mt-2">
              <HabitForm 
                newHabit={newHabit}
                onCancel={() => {
                  setAddingHabit(false);
                  setActiveTab("all");
                }}
                onSave={handleSaveHabit}
                onHabitChange={updateHabit}
              />
            </TabsContent>
            
            <TabsContent value="saved" className="mt-2">
              <SavedHabitsView habits={habits} />
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
};

export default HabitTrackerContent;
