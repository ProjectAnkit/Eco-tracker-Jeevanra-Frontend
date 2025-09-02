'use client';

import React from 'react';
import { Activity, Zap, Car, Bus, Train, Bike, Plane, Utensils, Leaf } from "lucide-react";

// Shared utility functions
export const getActivityIcon = (type: string) => {
  switch (type) {
    case 'commute_car': return <Car className="h-5 w-5 text-blue-500" />;
    case 'commute_bus': return <Bus className="h-5 w-5 text-green-500" />;
    case 'commute_train': return <Train className="h-5 w-5 text-purple-500" />;
    case 'commute_motorcycle': return <Bike className="h-5 w-5 text-orange-500" />;
    case 'energy_kwh': return <Zap className="h-5 w-5 text-yellow-500" />;
    case 'air_travel': return <Plane className="h-5 w-5 text-red-500" />;
    case 'food_meat': return <Utensils className="h-5 w-5 text-rose-500" />;
    case 'food_plant': return <Leaf className="h-5 w-5 text-emerald-500" />;
    default: return <Activity className="h-5 w-5 text-gray-500" />;
  }
};

export const getActivityUnit = (type: string) => {
  if (type.startsWith('commute_')) return 'km';
  if (type === 'energy_kwh') return 'kWh';
  if (type === 'air_travel') return 'km';
  if (type === 'food_meat' || type === 'food_plant') return 'kg';
  return 'unit';
};

export const formatActivityDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

interface ActivityDetails {
  units: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

interface ActivityItem {
  id: string;
  type: string;
  details: string | ActivityDetails; // Can be stringified JSON or parsed object
  timestamp: string;
  emissionsKg: number;
}

const parseActivityDetails = (details: string | ActivityDetails): ActivityDetails => {
  if (typeof details === 'string') {
    try {
      return JSON.parse(details);
    } catch (e) {
      console.error('Failed to parse activity details:', e);
      return { units: 0 };
    }
  }
  return details;
};

type ActivitySize = 'default' | 'small';

interface ActivityListProps {
  activities: ActivityItem[];
  isLoading?: boolean;
  error?: Error | null;
  showHeader?: boolean;
  limit?: number;
  emptyMessage?: React.ReactNode;
  className?: string;
  size?: ActivitySize;
}

export function ActivityList({
  activities = [],
  isLoading = false,
  error = null,
  showHeader = true,
  limit = 10,
  emptyMessage = 'No activities found.',
  className = '',
  size = 'default'
}: ActivityListProps) {
  const isSmall = size === 'small';
  if (isLoading) {
    return (
      <div className={`space-y-4 ${className}`}>
        {showHeader && (
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium dark:text-gray-200">Recent Activities</h3>
            <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>
        )}
        {[...Array(limit)].map((_, i) => (
          <div key={i} className="flex items-start gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700">
            <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gray-200 dark:bg-gray-600 animate-pulse"></div>
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
      <div className={`p-4 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg ${className}`}>
        Failed to load activities. Please try again later.
      </div>
    );
  }

  if (!activities || activities.length === 0) {
    return (
      <div className={`p-6 text-center text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 ${className}`}>
        {typeof emptyMessage === 'string' ? <p>{emptyMessage}</p> : emptyMessage}
      </div>
    );
  }

  const displayedActivities = activities?.length ? (limit ? activities.slice(0, limit) : activities) : [];

  return (
    <div className={`space-y-4 ${className}`}>
      {showHeader && (
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium dark:text-gray-200">Activities</h3>
          {limit && activities.length > limit && (
            <span className="text-sm text-gray-500">
              Showing {limit} of {activities.length}
            </span>
          )}
        </div>
      )}
      <div className="space-y-3">
        {displayedActivities.map((activity) => {
          const details = parseActivityDetails(activity.details);
          return (
            <div key={activity.id} className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700">
              <div className={`${isSmall ? 'p-1' : 'p-1.5 sm:p-2'} bg-gray-50 dark:bg-gray-700 rounded-full flex-shrink-0 mt-0.5`}>
                {(() => {
                  const icon = getActivityIcon(activity.type);
                  return React.cloneElement(icon, {
                    className: `${isSmall ? 'h-4 w-4' : 'h-5 w-5'} ${icon.props.className}`
                  });
                })()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <h4 className="text-xs sm:text-sm font-medium capitalize dark:text-gray-200 truncate max-w-[40%] sm:max-w-none">
                    {activity.type.replace('_', ' ')}
                  </h4>
                  <span className="text-[10px] sm:text-xs text-gray-500 whitespace-nowrap">
                    {details.units} {getActivityUnit(activity.type)}
                  </span>
                  <span className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                    {isSmall 
                      ? new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                      : formatActivityDate(activity.timestamp)
                    }
                  </span>
                </div>
                <p className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-300 whitespace-nowrap">
                  {activity.emissionsKg.toFixed(2)} kg CO₂
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
