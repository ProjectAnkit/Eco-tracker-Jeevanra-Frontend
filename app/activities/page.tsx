"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ActivityList } from "@/components/ActivityList";

const API_URL = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL;

export default function ActivitiesPage() {
  const { data: session } = useSession();

  const { data: activities, isLoading, error } = useQuery({
    queryKey: ["all-activities", session?.user?.email],
    queryFn: async () => {
      if (!session?.user?.email) {
        throw new Error('User email not found in session');
      }
      const res = await fetch(`${API_URL}/api/track/all?email=${encodeURIComponent(session.user.email)}`, {
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      if (!res.ok) {
        throw new Error('Failed to fetch activities');
      }
      return res.json();
    },
    enabled: !!session?.user?.email,
  });

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-6xl">
      <div className="flex items-center space-x-2 mb-6">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">All Activities</h1>
      </div>
      
      <ActivityList
        activities={activities || []}
        isLoading={isLoading}
        error={error}
        showHeader={false}
        emptyMessage={
          <div className="text-center">
            <p>No activities found.</p>
            <p className="text-sm mt-1">Start tracking your carbon footprint to see your activities here!</p>
          </div>
        }
      />
    </div>
  );
}
