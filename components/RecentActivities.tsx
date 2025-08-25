"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { Activity, Clock, Zap, Car, Home, Plane } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL;

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'commute_car':
      return <Car className="h-5 w-5 text-blue-500" />;
    case 'energy_kwh':
      return <Zap className="h-5 w-5 text-yellow-500" />;
    default:
      return <Activity className="h-5 w-5 text-gray-500" />;
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export default function RecentActivities({ limit = 3 }: { limit?: number }) {
  const { data: session } = useSession();

  const { data: activities, isLoading, error } = useQuery({
    queryKey: ["recent-activities", limit],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/track/recent?limit=${limit}`, {
        headers: { Authorization: `Bearer ${session?.accessToken}` },
      });
      return res.json();
    },
    enabled: !!session,
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium dark:text-gray-200">Recent Activities</h3>
          <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>
        {[...Array(limit)].map((_, i) => (
          <div key={i} className="flex items-start gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700">
            <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-600 animate-pulse"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
              <div className="h-3 w-1/2 bg-gray-100 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg">
        Failed to load recent activities. Please try again later.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium dark:text-gray-200">Recent Activities</h3>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/activities" className="dark:text-gray-300 dark:hover:bg-gray-700">
            View All
          </Link>
        </Button>
      </div>
      
      {activities?.length > 0 ? (
        <div className="space-y-3">
          {activities.map((activity: any) => (
            <div key={activity.id} className="flex items-start gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700">
              <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded-full">
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium capitalize dark:text-gray-200">
                    {activity.type.replace('_', ' ')}
                  </h4>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(activity.timestamp)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {activity.emissionsKg.toFixed(2)} kg CO₂
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-6 text-center text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <p>No activities tracked yet.</p>
          <p className="text-sm mt-1">Start tracking your carbon footprint!</p>
        </div>
      )}
    </div>
  );
}
