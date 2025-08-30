'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Trophy, Crown, Medal, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getLeaderboard, getUserRanking } from '@/lib/challenge-api';
//
import { useSession } from 'next-auth/react';

export default function LeaderboardPage() {
  const { id } = useParams();
  const router = useRouter();
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [userRank, setUserRank] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { data: session } = useSession();

  useEffect(() => {
    // Guard against undefined id or session
    if (!id || !session?.user?.email || !session?.accessToken) return;

    const loadLeaderboard = async () => {
      try {
        setIsLoading(true);
        
        const challengeId = Number(id);
        if (isNaN(challengeId)) {
          throw new Error(`Invalid challenge ID: ${id}`);
        }
        
        const [leaderboardData, rankingData] = await Promise.all([
          getLeaderboard(challengeId, session.accessToken!),
          getUserRanking(session.user!.email!, challengeId, session.accessToken!)
        ]);
        setLeaderboard(leaderboardData);
        setUserRank(rankingData);
      } finally {
        setIsLoading(false);
      }
    };

    loadLeaderboard();
  }, [id, session]);

  if (isLoading) {
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-6">
          {/* Back button skeleton */}
          <div className="h-9 w-24 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
          
          {/* Header skeleton */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-emerald-50 to-cyan-50 dark:from-slate-900 dark:to-slate-900">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="space-y-2">
                  <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-48"></div>
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-64"></div>
                </div>
                <div className="flex items-center bg-white dark:bg-slate-800 px-4 py-2.5 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 w-40">
                  <div className="bg-slate-200 dark:bg-slate-700 p-1.5 rounded-lg mr-3 w-8 h-8"></div>
                  <div className="space-y-1">
                    <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-16"></div>
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-10"></div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Podium skeleton */}
            <div className="p-6">
              <div className="grid grid-cols-3 gap-4 mb-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div className={`w-full bg-slate-200 dark:bg-slate-700 h-24 rounded-t-lg ${
                      i === 2 ? 'h-32 -mt-6' : i === 3 ? 'h-20' : ''
                    }`}></div>
                    <div className="w-full bg-white dark:bg-slate-800 p-3 rounded-b-lg border border-t-0 border-slate-200 dark:border-slate-700">
                      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mx-auto"></div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* List items skeleton */}
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center space-x-4">
                      <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-700"></div>
                      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-32"></div>
                    </div>
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-20"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <Button 
        variant="ghost" 
        onClick={() => router.back()}
        className="mb-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Challenge
      </Button>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-emerald-50 to-cyan-50 dark:from-slate-900 dark:to-slate-900">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Challenge Leaderboard</h1>
              <p className="text-slate-500 dark:text-slate-400 mt-1">
                Track your progress and compete with others
              </p>
            </div>
            {userRank !== null && (
              <div className="flex items-center bg-white dark:bg-slate-800 px-4 py-2.5 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
                <div className="bg-emerald-100 dark:bg-emerald-900/30 p-1.5 rounded-lg mr-3">
                  <Trophy className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Your Rank</p>
                  <p className="font-semibold text-slate-900 dark:text-white">#{userRank}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="p-6">
          {leaderboard.length === 0 ? (
            <div className="text-center py-12">
              <Trophy className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600 mb-4" />
              <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-1">No participants yet</h3>
              <p className="text-slate-500 dark:text-slate-400 mb-6">Be the first to join this challenge!</p>
              <Button 
                onClick={() => router.back()}
                className="bg-gradient-to-r from-emerald-600 to-cyan-500 hover:from-emerald-700 hover:to-cyan-600 text-white shadow-md hover:shadow-lg"
              >
                Join Challenge
              </Button>
            </div>
          ) : (
            <>
              {/* Top 3 Podium */}
              {leaderboard.length >= 3 && (
                <div className="grid grid-cols-3 gap-4 mb-8">
                  {[1, 0, 2].map((podiumIndex) => {
                    if (podiumIndex >= leaderboard.length) return null;
                    const participant = leaderboard[podiumIndex];
                    const isCurrentUser = participant.email === session?.user?.email;
                    const rank = podiumIndex + 1;
                    
                    return (
                      <div 
                        key={participant.id}
                        className={`flex flex-col items-center ${
                          podiumIndex === 1 ? '-mt-6' : ''
                        }`}
                      >
                        <div className={`w-full bg-gradient-to-b ${
                          rank === 1 
                            ? 'from-yellow-400 to-yellow-300 dark:from-yellow-500 dark:to-yellow-400 h-24' 
                            : rank === 2 
                              ? 'from-slate-300 to-slate-200 dark:from-slate-600 dark:to-slate-500 h-32' 
                              : 'from-amber-600 to-amber-500 dark:from-amber-700 dark:to-amber-600 h-20'
                        } rounded-t-lg flex items-end justify-center p-2 relative`}>
                          {/* Rank Badge */}
                          <div className={`absolute -top-4 left-1/2 -translate-x-1/2 flex items-center justify-center w-10 h-10 rounded-full ${
                            rank === 1 
                              ? 'bg-yellow-500 text-white' 
                              : rank === 2 
                                ? 'bg-slate-500 text-white' 
                                : 'bg-amber-600 text-white'
                          } font-bold shadow-lg`}>
                            {rank === 1 ? <Crown className="h-5 w-5" /> : rank === 2 ? <Medal className="h-5 w-5" /> : <Star className="h-5 w-5" />}
                          </div>
                          
                          {/* Avatar */}
                          <Avatar className="w-16 h-16 mb-2 border-2 border-white dark:border-slate-800 shadow-lg">
                            <AvatarImage src={participant.avatar} alt={participant.name} />
                            <AvatarFallback className="text-lg font-semibold">
                              {participant.name ? participant.name.charAt(0).toUpperCase() : 'U'}
                            </AvatarFallback>
                          </Avatar>
                          
                          <div className="text-center">
                            <div className={`text-sm font-medium ${
                              rank === 1 
                                ? 'text-yellow-900' 
                                : rank === 2 
                                  ? 'text-slate-900 dark:text-white' 
                                  : 'text-amber-900'
                            }`}>
                              {participant.name || 'Anonymous'}
                            </div>
                            <div className={`text-xs ${
                              rank === 1 
                                ? 'text-yellow-800' 
                                : rank === 2 
                                  ? 'text-slate-700 dark:text-slate-300' 
                                  : 'text-amber-800'
                            }`}>
                              {participant.co2Saved.toFixed(1)} kg CO₂
                            </div>
                          </div>
                        </div>
                        <div className={`w-full bg-white dark:bg-slate-800 p-3 rounded-b-lg border border-t-0 ${
                          rank === 1 
                            ? 'border-yellow-200 dark:border-yellow-900' 
                            : rank === 2 
                              ? 'border-slate-200 dark:border-slate-700' 
                              : 'border-amber-200 dark:border-amber-900'
                        }`}>
                          <div className="text-center">
                            <div className="text-xs text-slate-500 dark:text-slate-400">Rank</div>
                            <div className="font-semibold text-slate-900 dark:text-white">#{rank}</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              
              {/* Complete Leaderboard */}
              <div className="space-y-3">
                {leaderboard.map((participant, index) => {
                  const rank = index + 1;
                  const isCurrentUser = participant.email === session?.user?.email;
                  const hasPodium = leaderboard.length >= 3;
                  // Skip top 3 only when podium is displayed
                  if (hasPodium && rank <= 3) return null;
                  
                  return (
                    <div 
                      key={participant.id}
                      className={`flex items-center justify-between p-4 rounded-xl ${
                        isCurrentUser 
                          ? 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800' 
                          : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700'
                      } hover:shadow-md transition-shadow`}
                    >
                      <div className="flex items-center space-x-4">
                        {/* Rank Badge */}
                        <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                          isCurrentUser 
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-800/30 dark:text-emerald-400' 
                            : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                        } font-medium text-sm border-2 border-white dark:border-slate-600`}>
                          #{rank}
                        </div>
                        
                        {/* Avatar and Name */}
                        <div className="flex items-center space-x-3">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={participant.avatar} alt={participant.name} />
                            <AvatarFallback className="text-sm font-medium">
                              {participant.name ? participant.name.charAt(0).toUpperCase() : 'U'}
                            </AvatarFallback>
                          </Avatar>
                          
                          <div>
                            <span className={`font-medium ${
                              isCurrentUser 
                                ? 'text-emerald-700 dark:text-emerald-400' 
                                : 'text-slate-900 dark:text-white'
                            }`}>
                              {participant.name || 'Anonymous'}
                              {isCurrentUser && (
                                <span className="ml-2 text-xs bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-full">
                                  You
                                </span>
                              )}
                            </span>
                            <div className="text-xs text-slate-500 dark:text-slate-400">
                              {participant.email}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* CO2 Saved and Points */}
                      <div className="text-right">
                        <div className="font-semibold text-slate-900 dark:text-white">
                          {participant.co2Saved.toFixed(1)} <span className="text-slate-500 dark:text-slate-400 text-sm font-normal">kg CO₂</span>
                        </div>
                        <div className="text-sm text-slate-500 dark:text-slate-400">
                          {participant.points || 0} points
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
