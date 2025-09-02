'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, MapPin, Edit, Car, Bike, Footprints, Bus } from 'lucide-react';
import { fetchWeather, getTransportSuggestion, getWeatherIcon, WeatherData } from '@/lib/weather-api';
import { useSession } from 'next-auth/react';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';

interface UserProfile {
  location: string;
}

export default function WeatherSuggestion() {
  const { data: session } = useSession();
  const router = useRouter();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [locationValid, setLocationValid] = useState(true);

  useEffect(() => {
    let isMounted = true;
    
    const loadProfile = async () => {
      if (!session?.user?.email) {
        if (isMounted) setIsLoading(false);
        return;
      }
      
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL;
        const res = await fetch(`${API_URL}/api/profile?email=${encodeURIComponent(session.user.email)}`, {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
          next: { revalidate: 60 } // Cache for 60 seconds
        });
        
        if (!isMounted) return;
        
        if (res.ok) {
          const data = await res.json();
          setProfile(data);
          if (data?.location) {
            await fetchWeatherData(data.location);
          } else {
            setLocationValid(false);
            setIsLoading(false);
          }
        } else {
          throw new Error('Failed to load profile');
        }
      } catch (err) {
        console.error('Error loading profile:', err);
        if (isMounted) {
          setError('Failed to load profile');
          setIsLoading(false);
        }
      }
    };

    loadProfile();
    
    return () => {
      isMounted = false;
    };
  }, [session?.user?.email, session?.accessToken]);

  const fetchWeatherData = async (location: string) => {
    try {
      setIsLoading(true);
      const data = await fetchWeather(location);
      if (data) {
        setWeather(data);
        setLocationValid(true);
      } else {
        setLocationValid(false);
        setError('Could not find weather for this location');
      }
    } catch (err) {
      setLocationValid(false);
      setError('Failed to fetch weather data');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateLocation = () => {
    router.push('/profile');
  };

  if (isLoading) {
    return (
      <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
        <CardContent className="p-4">
          <div className="flex items-center justify-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin text-emerald-600" />
            <span className="text-sm">Fetching weather...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!profile?.location) {
    return (
      <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
        <CardContent className="p-4 text-center">
          <p className="text-sm text-muted-foreground mb-3">No location set in your profile</p>
          <Button 
            size="sm" 
            onClick={handleUpdateLocation}
            className="gap-2"
          >
            <Edit className="h-4 w-4" />
            Add Location to Profile
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!locationValid || !weather) {
    return (
      <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
        <CardContent className="p-4 text-center">
          <p className="text-sm text-muted-foreground mb-3">
            {error || 'Could not find weather for your location'}
          </p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleUpdateLocation}
            className="gap-2"
          >
            <Edit className="h-4 w-4" />
            Update Location
          </Button>
        </CardContent>
      </Card>
    );
  }

  const suggestion = getTransportSuggestion(weather.current.condition.text);
  const weatherIcon = getWeatherIcon(weather.current.condition.text);
  const temperature = Math.round(weather.current.temp_c);
  const locationName = `${weather.location.name}, ${weather.location.country}`;

  const getTransportIcon = () => {
    const iconClass = 'text-white';
    const bgClass = 'p-3 rounded-full';
    
    if (suggestion.includes('car')) 
      return <div className={`${bgClass} bg-blue-500`}><Car className={iconClass} size={32} /></div>;
    if (suggestion.includes('walk')) 
      return <div className={`${bgClass} bg-purple-500`}><Bus className={iconClass} size={32} /></div>;
    if (suggestion.includes('bike')) 
      return <div className={`${bgClass} bg-green-500`}><Bike className={iconClass} size={32} /></div>;
    if (suggestion.includes('walk')) 
      return <div className={`${bgClass} bg-purple-500`}><Footprints className={iconClass} size={32} /></div>;
    return <div className={`${bgClass} bg-amber-500`}><Bus className={iconClass} size={32} /></div>;
  };

  return (
    <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-3xl">{weatherIcon}</span>
              <span className="text-2xl font-bold">{temperature}°C</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
              <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
              <span className="truncate">{locationName}</span>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-slate-800 dark:to-slate-700 p-4 rounded-lg border border-slate-100 dark:border-slate-700">
            <div className="text-right">
              <p className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Recommended Transport</p>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white">
                {suggestion.includes('car') && 'Car'}
                {suggestion.includes('walk') && 'Walk'}
                {suggestion.includes('bike') && 'Bike'}
                {suggestion.includes('public') && 'Public Transport'}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                {suggestion.includes('car') && 'Best option for this weather'}
                {suggestion.includes('walk') && 'Perfect weather for walking'}
                {suggestion.includes('bike') && 'Great day for a ride!'}
                {suggestion.includes('public') && 'Eco-friendly choice for today'}
              </p>
            </div>
            {getTransportIcon()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
