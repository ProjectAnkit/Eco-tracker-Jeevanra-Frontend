"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { Button } from "./ui/button";
import Link from "next/link";
import { ActivityList } from "./ActivityList";

const API_URL = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL;

export default function RecentActivities({ limit = 3, size = "default" }: { limit?: number, size?: "default" | "small" }) {
  const { data: session } = useSession();

  const { data: activities, isLoading, error } = useQuery({
    queryKey: ["recent-activities", limit],
    queryFn: async () => {
      const res = await fetch(
        `${API_URL}/api/track/recent?limit=${limit}&email=${encodeURIComponent(session?.user?.email ?? '')}`,
        { headers: { Authorization: `Bearer ${session?.accessToken}` } }
      );
      const data = await res.json();
      console.log("API Response:", data);
      return data;
    },
    enabled: !!session,
  });

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
      
      <ActivityList
        activities={activities || []}
        isLoading={isLoading}
        error={error}
        showHeader={false}
        limit={limit}
        emptyMessage={
          <div className="text-center">
            <p>No activities tracked yet.</p>
            <p className="text-sm mt-1">Start tracking your carbon footprint!</p>
          </div>
        }
        size={size}
      />
    </div>
  );
}
