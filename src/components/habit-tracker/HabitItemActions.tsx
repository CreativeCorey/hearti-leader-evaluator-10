
import React, { useState } from 'react';
import { MoreHorizontal, Trash2, Ban } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useLanguage } from '@/contexts/language/LanguageContext';
import { HabitItemActionsProps } from '@/types';

const HabitItemActions: React.FC<HabitItemActionsProps> = ({
  id,
  onDelete,
  onSkipToday,
  isCompletedToday,
  skippedToday
}) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { t } = useLanguage();
  
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="px-1">
            <MoreHorizontal size={18} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          {!isCompletedToday && !skippedToday && (
            <DropdownMenuItem onClick={() => onSkipToday(id)}>
              <Ban className="mr-2 h-4 w-4" />
              <span>{t('results.habits.skipToday', { fallback: "Skip Today" })}</span>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={() => setDeleteDialogOpen(true)}>
            <Trash2 className="mr-2 h-4 w-4 text-destructive" />
            <span className="text-destructive">{t('results.habits.delete', { fallback: "Delete" })}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('results.habits.deleteConfirmTitle', { fallback: "Delete Habit?" })}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('results.habits.deleteConfirmDescription', { fallback: "This action cannot be undone. This will permanently delete this habit and all of its completion history." })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel', { fallback: "Cancel" })}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => onDelete(id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t('results.habits.delete', { fallback: "Delete" })}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default HabitItemActions;
