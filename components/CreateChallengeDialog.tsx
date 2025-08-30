'use client';

import { useState, useEffect } from 'react';
import { Award, BarChart2, Loader2, Plus } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { createChallenge } from '@/lib/challenge-api';
import { toast } from 'sonner';
import { Challenge } from '@/types/challenge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { useSession } from 'next-auth/react';

interface CreateChallengeDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onChallengeCreated?: (challenge: Challenge) => void;
  children?: React.ReactNode;
}

export function CreateChallengeDialog({
  open,
  onOpenChange,
  onChallengeCreated,
  children,
}: CreateChallengeDialogProps) {
  const [isOpen, setIsOpen] = useState(open || false);
  
  useEffect(() => {
    if (open !== undefined) {
      setIsOpen(open);
    }
  }, [open]);

  const handleOpenChange = (newOpen: boolean) => {
    setIsOpen(newOpen);
    onOpenChange?.(newOpen);
  };
  const [name, setName] = useState('');
  const [goal, setGoal] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: session } = useSession();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !goal.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    const goalValue = goal.trim() === '' ? 0 : parseFloat(goal);
    if (isNaN(goalValue) || goalValue <= 0) {
      toast.error('Please enter a valid goal amount');
      return;
    }

    try {
      setIsSubmitting(true);
      const newChallenge = await createChallenge({
        name: name.trim(),
        goal: goalValue,
      }, session?.accessToken || '');
      
      // Only call onChallengeCreated if it's provided
      onChallengeCreated?.(newChallenge);
      
      // Reset form and close dialog
      setName('');
      setGoal('');
      handleOpenChange(false);
      
      toast.success('Challenge created successfully!');
    } catch (error) {
      console.error('Error creating challenge:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to create challenge';
      toast.error(errorMessage);
      throw error; // Re-throw to allow error boundary to catch it if needed
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      {children ? (
        <DialogTrigger asChild>{children}</DialogTrigger>
      ) : (
        <DialogTrigger asChild>
          <Button className="bg-gradient-to-r from-emerald-600 to-cyan-500 hover:from-emerald-700 hover:to-cyan-600 text-white shadow-md hover:shadow-lg transition-all duration-300">
            <Plus className="h-4 w-4 mr-2" />
            Create Challenge
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[425px] rounded-xl border-slate-200 dark:border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-slate-900 dark:text-white">Create New Challenge</DialogTitle>
          <DialogDescription className="text-slate-500 dark:text-slate-400">
            Set up a new sustainability challenge and inspire others to reduce their carbon footprint.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Challenge Name
            </Label>
            <div className="relative">
              <Input
                id="name"
                placeholder="Eco Warriors 2023"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-9 h-11 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
              />
              <Award className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="goal" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                CO₂ Reduction Goal (kg)
              </Label>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Recommended: 100-1000 kg
              </span>
            </div>
            <div className="relative">
              <Input
                id="goal"
                type="number"
                placeholder="500"
                min="1"
                step="10"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="pl-9 h-11 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
              />
              <BarChart2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            </div>
          </div>
        </div>
        <DialogFooter className="flex flex-col sm:flex-row gap-3">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange?.(false)}
            className="w-full sm:w-auto border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting}
            className="w-full sm:w-auto bg-gradient-to-r from-emerald-600 to-cyan-500 hover:from-emerald-700 hover:to-cyan-600 text-white shadow-md hover:shadow-lg transition-all duration-300"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              'Create Challenge'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
