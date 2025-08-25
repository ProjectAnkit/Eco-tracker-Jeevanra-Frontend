"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { Activity, Clock, Zap, Car, Home, Plane, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export default function ActivitiesPage() {
  const { data: session } = useSession();

  const { data: activities, isLoading, error } = useQuery({
    queryKey: ["all-activities"],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/track/all`, {
        headers: { Authorization: `Bearer ${session?.accessToken}` },
      });
      return res.json();
    },
    enabled: !!session,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 max-w-4xl">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" asChild className="dark:text-gray-300 dark:hover:bg-gray-700">
            <Link href="/dashboard">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold dark:text-white">All Activities</h1>
        </div>
        
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-start gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700">
              <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-600 animate-pulse"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                <div className="h-3 w-1/2 bg-gray-100 dark:bg-gray-600 rounded animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 max-w-4xl">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" asChild className="dark:text-gray-300 dark:hover:bg-gray-700">
            <Link href="/dashboard">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold dark:text-white">All Activities</h1>
        </div>
        
        <div className="p-6 text-center text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 rounded-lg">
          Failed to load activities. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold dark:text-white">All Activities</h1>
      </div>
      
      {activities?.length > 0 ? (
        <div className="space-y-3">
          {activities.map((activity: any) => (
            <div key={activity.id} className="flex items-start gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700">
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
                {activity.details && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {JSON.parse(activity.details)?.units} units
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-8 text-center bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
            <Activity className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-200 mb-1">No activities yet</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">Start tracking your carbon footprint to see your activities here.</p>
          <Button asChild>
            <Link href="/track">Track Activity</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
