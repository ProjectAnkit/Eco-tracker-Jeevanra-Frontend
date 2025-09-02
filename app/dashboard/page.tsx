"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement } from "chart.js";
import { Line } from "react-chartjs-2";
import { useSession } from "next-auth/react";
import { TrendingDown, Leaf, Target, Award } from "lucide-react";
import { getChallenges, getUserRanking } from "@/lib/challenge-api";
import Protected from "@/components/Protected";
import RecentActivities from "@/components/RecentActivities";
import WeatherSuggestion from "@/components/WeatherSuggestion";
import { toastError } from "@/lib/toast";

const API_URL = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL;

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

export default function Dashboard() {
  const { data: session } = useSession();

  const { data: emissions } = useQuery({
    queryKey: ["emissions"],
    queryFn: async () => {
      if (!session?.user?.email) {
        throw new Error("User email not available");
      }
      const res = await fetch(`${API_URL}/api/reports?email=${encodeURIComponent(session.user.email)}`, {
        headers: { Authorization: `Bearer ${session?.accessToken}` },
      });
      if (!res.ok) {
        throw new Error(`Failed to fetch reports: ${res.status}`);
      }
      return res.json();
    },
    enabled: !!session?.user?.email,
  });

  // Fetch user profile for points and total CO2 saved
  const { data: profile } = useQuery({
    queryKey: ["profile", session?.user?.email],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/profile?email=${encodeURIComponent(session!.user!.email!)}`, {
        headers: { Authorization: `Bearer ${session?.accessToken}` },
      });
      if (!res.ok) throw new Error("Failed to fetch profile");
      return res.json();
    },
    enabled: !!session?.user?.email,
  });

  // Determine current challenge and rank for this user
  const { data: currentRank } = useQuery({
    queryKey: ["current-rank", session?.user?.email],
    queryFn: async () => {
      // get all challenges
      const challenges = await getChallenges(session!.accessToken!);
      const email = session!.user!.email!;
      // try to find first challenge where ranking exists
      for (const ch of challenges) {
        try {
          const rank = await getUserRanking(email, ch.id, session!.accessToken!);
          if (typeof rank === "number") {
            return { rank, challengeName: ch.name };
          }
        } catch (error) {
            console.error("Error getting user rank:", error);
            toastError("Failed to get user rank");
        }
      }
      return null;
    },
    enabled: !!session?.accessToken && !!session?.user?.email,
  });

  const chartData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "CO2 Emissions (kg)",
        data: emissions?.weekly || [2.5, 1.8, 3.2, 2.1, 1.5, 2.8, 1.9],
        borderColor: "#10b981",
        backgroundColor: "rgba(16, 185, 129, 0.15)",
        fill: true,
        tension: 0.4,
        borderWidth: 2.5,
        pointBackgroundColor: "#10b981",
        pointBorderColor: "#ffffff",
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: "#10b981",
        pointHoverBorderColor: "#ffffff",
        pointHoverBorderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(148, 163, 184, 0.2)',
          drawBorder: false,
        },
        ticks: {
          color: '#64748b',
          font: { size: 11 },
          padding: 8,
        },
        border: {
          display: false,
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#64748b',
          font: { size: 11 },
          padding: 8,
        },
        border: {
          display: false,
        },
      },
    },
    interaction: {
      intersect: false,
      mode: 'index' as const,
    },
  };

  return (
    <Protected>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-cyan-50 dark:from-slate-900 dark:via-emerald-900/30 dark:to-cyan-900/20 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Weather Suggestion */}
          <WeatherSuggestion />
          
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-full bg-emerald-50 dark:bg-emerald-900/30">
                <TrendingDown className="h-5 w-5 text-emerald-600" />
              </div>
              <div className="text-sm font-medium text-muted-foreground">This Week</div>
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              {emissions?.total?.toFixed ? emissions.total.toFixed(1) : (emissions?.total || 0)} kg
            </div>
            <div className="text-sm text-muted-foreground mt-1">Weekly total</div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-full bg-emerald-50 dark:bg-emerald-900/30">
                <Leaf className="h-5 w-5 text-emerald-600" />
              </div>
              <div className="text-sm font-medium text-muted-foreground">Points</div>
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">{profile?.points || 0}</div>
            <div className="text-sm text-muted-foreground mt-1">Total points</div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-full bg-emerald-50 dark:bg-emerald-900/30">
                <Target className="h-5 w-5 text-emerald-600" />
              </div>
              <div className="text-sm font-medium text-muted-foreground">Emitted</div>
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              {profile?.co2Saved?.toFixed ? profile.co2Saved.toFixed(1) : (profile?.co2Saved || 0)} kg
            </div>
            <div className="text-sm text-muted-foreground mt-1">Total CO₂ emitted</div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-full bg-emerald-50 dark:bg-emerald-900/30">
                <Award className="h-5 w-5 text-emerald-600" />
              </div>
              <div className="text-sm font-medium text-muted-foreground">Rank</div>
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              {currentRank ? `#${currentRank.rank}` : '—'}
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              {currentRank ? `in ${currentRank.challengeName}` : 'No active challenge'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart and Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Emissions Chart - Takes 2/3 width on larger screens */}
        <Card className="lg:col-span-2 w-full bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
          <CardHeader className="pb-3 px-6 pt-6">
            <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">Weekly Emissions</CardTitle>
          </CardHeader>
          <CardContent className="px-6 pb-6 pt-0">
            <div className="h-80 w-full">
              <Line data={chartData} options={chartOptions} />
            </div>
          </CardContent>
        </Card>
        
        {/* Recent Activities - Takes 1/3 width on larger screens */}
        <div className="w-full">
          <Card className="h-full bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
            <CardContent className="px-6 pb-6 pt-0">
              <RecentActivities limit={5} size="small" />
            </CardContent>
          </Card>
        </div>
          </div>
        </div>
      </div>
    </Protected>
  );
}