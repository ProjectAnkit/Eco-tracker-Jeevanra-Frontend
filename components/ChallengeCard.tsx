'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Users, Award, BarChart, BarChart2, Plus, LogOut, Loader2 } from 'lucide-react';
import { Challenge } from '@/types/challenge';
import { joinChallenge, leaveChallenge } from '@/lib/challenge-api';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

interface ChallengeCardProps {
  challenge: Challenge;
  onUpdate: (challenge: Challenge) => void;
}

export function ChallengeCard({ challenge, onUpdate }: ChallengeCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  const isParticipating = (challenge.participants || []).some(
    (participant: any) => participant?.email === session?.user?.email
  );

  const handleJoin = async () => {
    try {
      setIsLoading(true);
      const updatedChallenge = await joinChallenge(challenge.id, session?.user?.email || '', session?.accessToken || '');
      onUpdate(updatedChallenge);
      toast.success('Joined challenge!');
    } catch (error) {
      console.error('Error joining challenge:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to join challenge');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLeave = async () => {
    try {
      setIsLoading(true);
      const updatedChallenge = await leaveChallenge(challenge.id, session?.user?.email || '', session?.accessToken || '');
      onUpdate(updatedChallenge);
      toast.success('Left challenge.');
    } catch (error) {
      console.error('Error leaving challenge:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to leave challenge');
    } finally {
      setIsLoading(false);
    }
  };

  const viewLeaderboard = () => {
    router.push(`/challenges/${challenge.id}/leaderboard`);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-md hover:shadow-xl transition-all duration-200 border border-slate-100 dark:border-slate-800 max-w-sm w-full">
      <div className="p-3.5">
        <div className="flex justify-between items-center mb-2.5">
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 truncate max-w-[65%]">{challenge.name}</h3>
          <div className="flex items-center px-1.5 py-0.5 rounded-full bg-emerald-200/50 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 text-[10px] font-medium">
            <Users className="h-2.5 w-2.5 mr-0.5" />
            <span>{challenge.participants?.length || 0}</span>
          </div>
        </div>

        <div className="space-y-2 mb-3">
          <div className="flex items-center text-[13px] text-slate-700 dark:text-slate-300">
            <div className="p-0.5 mr-1.5 rounded-sm bg-emerald-100/50 dark:bg-emerald-900/40">
              <BarChart className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="truncate">
              <span className="text-[11px] text-slate-500 dark:text-slate-400">Target</span>
              <span className="ml-1 font-medium">{challenge.goal} kg CO₂</span>
            </div>
          </div>
          <div className="flex items-center text-[13px] text-slate-700 dark:text-slate-300">
            <div className="p-0.5 mr-1.5 rounded-sm bg-amber-100/50 dark:bg-amber-900/40">
              <Award className="h-3 w-3 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="flex-1">
              <span className="text-[11px] text-slate-500 dark:text-slate-400">Participants</span>
              <div className="flex items-center mt-0.5">
                <div className="flex -space-x-1">
                  {challenge.participants?.slice(0, 3).map((participant: any) => (
                    <Avatar
                      key={participant.id}
                      className="w-5 h-5 border-1.5 border-white dark:border-slate-900 hover:scale-110 transition-transform duration-150"
                      title={participant.name || participant?.email}
                    >
                      <AvatarImage src={participant?.avatar} alt={participant.name || participant?.email} />
                      <AvatarFallback className="text-[9px] font-medium bg-emerald-100 dark:bg-emerald-800/80 text-emerald-700 dark:text-emerald-300">
                        {(participant.name || participant?.email || 'U').charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                </div>
                {challenge.participants && challenge.participants.length > 3 && (
                  <span className="ml-1 text-[9px] text-slate-500 dark:text-slate-400">
                    +{challenge.participants.length - 3}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-1.5">
          {isParticipating ? (
            <>
              <Button
                onClick={viewLeaderboard}
                variant="outline"
                className="flex-1 h-7 text-[11px] font-medium border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg"
              >
                <BarChart2 className="h-3 w-3 mr-0.5" />
                Leaderboard
              </Button>
              <Button
                variant="ghost"
                onClick={handleLeave}
                disabled={isLoading}
                className="flex-1 h-7 text-[11px] font-medium text-rose-600 hover:bg-rose-50/50 hover:text-rose-700 dark:text-rose-400 dark:hover:bg-rose-900/20 rounded-lg"
              >
                {isLoading ? (
                  <Loader2 className="h-3 w-3 mr-0.5 animate-spin" />
                ) : (
                  <LogOut className="h-3 w-3 mr-0.5" />
                )}
                Leave
              </Button>
            </>
          ) : (
            <Button
              onClick={handleJoin}
              disabled={isLoading}
              className="w-full h-7 text-[11px] font-medium bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700 text-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              {isLoading ? (
                <Loader2 className="h-3 w-3 mr-0.5 animate-spin" />
              ) : (
                <Plus className="h-3 w-3 mr-0.5" />
              )}
              Join
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}