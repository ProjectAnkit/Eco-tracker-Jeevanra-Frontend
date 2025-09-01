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
    <div className="p-4 space-y-4 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
        <div className="text-sm text-muted-foreground">Welcome back, {session?.user?.email?.split("@")[0]}</div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="bg-card border shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-emerald-600" />
              <div className="text-xs text-muted-foreground">This Week</div>
            </div>
            <div className="text-lg font-semibold text-card-foreground mt-1">
              {emissions?.total?.toFixed ? emissions.total.toFixed(1) : (emissions?.total || 0)} kg
            </div>
            <div className="text-xs text-muted-foreground">Weekly total</div>
          </CardContent>
        </Card>

        <Card className="bg-card border shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Leaf className="h-4 w-4 text-emerald-600" />
              <div className="text-xs text-muted-foreground">Points</div>
            </div>
            <div className="text-lg font-semibold text-card-foreground mt-1">{profile?.points || 0}</div>
            <div className="text-xs text-muted-foreground">Total points</div>
          </CardContent>
        </Card>

        <Card className="bg-card border shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-emerald-600" />
              <div className="text-xs text-muted-foreground">Emitted</div>
            </div>
            <div className="text-lg font-semibold text-card-foreground mt-1">{profile?.co2Saved?.toFixed ? profile.co2Saved.toFixed(1) : (profile?.co2Saved || 0)} kg</div>
            <div className="text-xs text-muted-foreground">Total CO₂ emitted</div>
          </CardContent>
        </Card>

        <Card className="bg-card border shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-emerald-600" />
              <div className="text-xs text-muted-foreground">Rank</div>
            </div>
            <div className="text-lg font-semibold text-card-foreground mt-1">
              {currentRank ? `#${currentRank.rank}` : "—"}
            </div>
            <div className="text-xs text-muted-foreground">
              {currentRank ? `in ${currentRank.challengeName}` : "No active challenge"}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart and Recent Activities */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Weekly Emissions Chart - Takes 2/3 width on larger screens */}
        <div className="md:col-span-2">
          <Card className="bg-card border shadow-sm h-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-medium text-card-foreground">Weekly Emissions</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="h-64">
                <Line data={chartData} options={chartOptions} />
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Recent Activities - Takes 1/3 width on larger screens */}
        <div className="md:col-span-1">
          <RecentActivities limit={5} size="small" />
        </div>
      </div>

      </div>
    </Protected>
  );
}