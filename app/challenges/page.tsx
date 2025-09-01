'use client';

import { useState, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Award } from 'lucide-react';
import { ChallengeCard } from '../../components/ChallengeCard';
import { CreateChallengeDialog } from '../../components/CreateChallengeDialog';
import { Challenge } from '@/types/challenge';
import { getChallenges, searchChallenges } from '@/lib/challenge-api';
import { useSession } from 'next-auth/react';

export default function ChallengesPage() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { data: session } = useSession();

  const loadChallenges = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getChallenges(session?.accessToken || '');
      console.log(data);
      console.log(session?.accessToken);
      setChallenges(data);
    } catch (error) {
      console.error('Error loading challenges:', error);
    } finally {
      setIsLoading(false);
    }
  }, [session?.accessToken]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const data = searchQuery ? await searchChallenges(searchQuery, session?.accessToken || '') : await getChallenges(session?.accessToken || '');
      setChallenges(data);
    } catch (error) {
      console.error('Error searching challenges:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChallengeCreated = (newChallenge: Challenge) => {
    setChallenges([...challenges, newChallenge]);
  };

  const handleChallengeUpdated = (updatedChallenge: Challenge) => {
    setChallenges(challenges.map(c => c.id === updatedChallenge.id ? updatedChallenge : c));
  };

  useEffect(() => {
    loadChallenges();
  }, [loadChallenges]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-cyan-50 dark:from-slate-900 dark:via-emerald-900/30 dark:to-cyan-900/20 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-cyan-500">
              Sustainability Challenges
            </span>
          </h1>
          <div className="flex flex-col sm:flex-row gap-4 max-w-4xl mx-auto w-full">
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Search challenges by name..."
                  className="pl-10 h-12 text-base border-slate-200 dark:border-slate-700 focus-visible:ring-2 focus-visible:ring-emerald-500 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </form>
            <CreateChallengeDialog 
              open={isCreateDialogOpen}
              onOpenChange={setIsCreateDialogOpen}
              onChallengeCreated={handleChallengeCreated}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-4 border border-slate-200 dark:border-slate-700 animate-pulse h-48">
                <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-3"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-slate-100 dark:bg-slate-700 rounded w-1/2"></div>
                  <div className="h-3 bg-slate-100 dark:bg-slate-700 rounded w-2/3"></div>
                </div>
                <div className="mt-6 h-8 bg-slate-100 dark:bg-slate-700 rounded-lg w-full"></div>
              </div>
            ))}
          </div>
        ) : challenges.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-12 text-center border-2 border-dashed border-slate-200 dark:border-slate-700">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-900/20 mb-4">
              <Award className="h-8 w-8 text-emerald-500 dark:text-emerald-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">No challenges found</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-md mx-auto">
              {searchQuery 
                ? 'No challenges match your search. Try a different term or create a new challenge.'
                : 'Be the pioneer! Create the first sustainability challenge and inspire others to join.'}
            </p>
            <div className="flex justify-center gap-3">
              {searchQuery && (
                <Button 
                  variant="outline"
                  onClick={() => setSearchQuery('')}
                  className="border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                >
                  Clear search
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {challenges.map((challenge) => (
              <div key={challenge.id} className="h-full">
                <ChallengeCard 
                  challenge={challenge}
                  onUpdate={handleChallengeUpdated}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
