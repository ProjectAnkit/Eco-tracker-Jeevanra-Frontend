"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement } from "chart.js";
import { Line } from "react-chartjs-2";
import { useSession } from "next-auth/react";
import { TrendingDown, Leaf, Target, Award } from "lucide-react";
import Protected from "@/components/Protected";
import RecentActivities from "@/components/RecentActivities";

const API_URL = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL;

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

export default function Dashboard() {
  const { data: session } = useSession();

  const { data: emissions } = useQuery({
    queryKey: ["emissions"],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/reports`, {
        headers: { Authorization: `Bearer ${session?.accessToken}` },
      });
      return res.json();
    },
    enabled: !!session,
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
              {emissions?.total || 15.8} kg
            </div>
            <div className="text-xs text-emerald-600">-12% from last week</div>
          </CardContent>
        </Card>

        <Card className="bg-card border shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Leaf className="h-4 w-4 text-emerald-600" />
              <div className="text-xs text-muted-foreground">Saved</div>
            </div>
            <div className="text-lg font-semibold text-card-foreground mt-1">2.1 kg</div>
            <div className="text-xs text-muted-foreground">CO2 this month</div>
          </CardContent>
        </Card>

        <Card className="bg-card border shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-emerald-600" />
              <div className="text-xs text-muted-foreground">Goal</div>
            </div>
            <div className="text-lg font-semibold text-card-foreground mt-1">78%</div>
            <div className="text-xs text-emerald-600">On track</div>
          </CardContent>
        </Card>

        <Card className="bg-card border shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-emerald-600" />
              <div className="text-xs text-muted-foreground">Rank</div>
            </div>
            <div className="text-lg font-semibold text-card-foreground mt-1">#24</div>
            <div className="text-xs text-muted-foreground">This month</div>
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
          <RecentActivities limit={5} />
        </div>
      </div>

      </div>
    </Protected>
  );
}