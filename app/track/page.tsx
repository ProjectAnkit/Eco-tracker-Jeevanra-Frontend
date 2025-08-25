"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Car, Bike, Bus, Train, Plane, Zap, Utensils, Clock } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL;

const activityTypes = [
  { id: "commute_car", name: "Car", unit: "km", icon: Car, category: "commute", tooltip: "Track CO2 from driving" },
  { id: "commute_motorcycle", name: "Motorcycle", unit: "km", icon: Bike, category: "commute", tooltip: "Track motorcycle travel emissions" },
  { id: "commute_bus", name: "Bus", unit: "km", icon: Bus, category: "commute", tooltip: "Track bus travel emissions" },
  { id: "commute_train", name: "Train", unit: "km", icon: Train, category: "commute", tooltip: "Track train travel emissions" },
  { id: "air_travel", name: "Flight", unit: "km", icon: Plane, category: "travel", tooltip: "Track flight emissions" },
  { id: "energy_kwh", name: "Electricity", unit: "kWh", icon: Zap, category: "home", tooltip: "Track household energy use" },
  { id: "food_meat", name: "Meat Meal", unit: "kg", icon: Utensils, category: "food", tooltip: "Track emissions from meat consumption" },
  { id: "food_plant", name: "Veg Meal", unit: "kg", icon: Utensils, category: "food", tooltip: "Track emissions from vegetarian/vegan meals" },
];

const categoryIcons = {
  commute: <Car className="h-4 w-4" />,
  travel: <Plane className="h-4 w-4" />,
  home: <Zap className="h-4 w-4" />,
  food: <Utensils className="h-4 w-4" />
};

export default function Track() {
  const [type, setType] = useState("commute_car");
  const [units, setUnits] = useState("");
  const { data: session } = useSession();

  const selectedType = activityTypes.find((t) => t.id === type);

  const mutation = useMutation({
    mutationFn: async () => {
      if (!units || isNaN(parseFloat(units)) || parseFloat(units) <= 0) {
        throw new Error("Please enter a valid positive number for units");
      }
      try {
        console.log('Sending request to:', `${API_URL}/api/track`);
        console.log('With token:', session?.accessToken ? 'Token exists' : 'No token');
        
        const res = await fetch(`${API_URL}/api/track`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session?.accessToken}`,
          },
          body: JSON.stringify({ 
            type, 
            units: parseFloat(units) 
          }),
        });
        
        const data = await res.json().catch(() => ({}));
        
        if (!res.ok) {
          console.error('API Error Response:', data);
          throw new Error(data.message || `Failed to track activity: ${res.status} ${res.statusText}`);
        }
        
        return data;
      } catch (error) {
        console.error('Error in mutation:', error);
        throw error;
      }
    },
    onSuccess: () => {
      alert("Activity tracked successfully!");
      setUnits("");
      refetchRecentActivities();
    },
    onError: (error) => {
      console.error('Mutation error:', error);
      alert(`Error: ${error.message}`);
    },
  });

  const { data: recentActivities, refetch: refetchRecentActivities } = useQuery({
    queryKey: ["recentActivities"],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/track/recent?limit=5`, {
        headers: { Authorization: `Bearer ${session?.accessToken}` },
      });
      if (!res.ok) throw new Error("Failed to fetch recent activities");
      return res.json();
    },
    enabled: !!session,
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 md:p-6 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight">Track Activity</h1>
            <p className="text-muted-foreground">
              Log your daily activities to monitor your carbon footprint
            </p>
          </div>
          
          <Tabs defaultValue="commute" className="w-full">
            <TabsList className="grid w-full grid-cols-4 h-auto p-1 bg-muted">
              {Object.entries({
                commute: 'Commute',
                travel: 'Travel',
                home: 'Home',
                food: 'Food'
              }).map(([key, label]) => (
                <TabsTrigger 
                  key={key} 
                  value={key}
                  className="py-2 text-sm data-[state=active]:shadow-sm"
                >
                  <span className="mr-2">{categoryIcons[key as keyof typeof categoryIcons] || <Car className="h-4 w-4" />}</span>
                  {label}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {Object.entries({
              commute: 'commute',
              travel: 'travel',
              home: 'home',
              food: 'food'
            }).map(([tab, category]) => (
              <TabsContent key={tab} value={tab} className="mt-6">
                <Card className="border-0 shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">
                      {category === 'commute' ? 'Transportation' : 
                       category === 'travel' ? 'Travel' : 
                       category === 'home' ? 'Home Energy' : 'Food & Diet'}
                    </CardTitle>
                    <CardDescription>
                      {category === 'commute' ? 'Track your daily commute emissions' :
                       category === 'travel' ? 'Log your travel emissions' :
                       category === 'home' ? 'Record your home energy usage' : 'Track your food-related emissions'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <TooltipProvider>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-6">
                        {activityTypes
                          .filter(activity => activity.category === category)
                          .map((activity) => (
                            <Tooltip key={activity.id}>
                              <TooltipTrigger asChild>
                                <motion.div
                                  whileHover={{ scale: 1.03 }}
                                  whileTap={{ scale: 0.98 }}
                                  onClick={() => setType(activity.id)}
                                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                                    type === activity.id
                                      ? "border-primary bg-primary/5"
                                      : "border-border hover:border-primary/30"
                                  }`}
                                >
                                  <div className="flex flex-col items-center text-center space-y-2">
                                    <div className={`p-2 rounded-lg ${
                                      type === activity.id 
                                        ? 'bg-primary/10 text-primary' 
                                        : 'bg-muted'
                                    }`}>
                                      <activity.icon className="h-5 w-5" />
                                    </div>
                                    <span className="text-sm font-medium">
                                      {activity.name}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                      ({activity.unit})
                                    </span>
                                  </div>
                                </motion.div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="text-sm">{activity.tooltip}</p>
                              </TooltipContent>
                            </Tooltip>
                          ))}
                      </div>
                    </TooltipProvider>
                    
                    <div className="space-y-4 pt-2">
                      <div className="space-y-2">
                        <label className="text-sm font-medium leading-none">
                          {selectedType?.name} ({selectedType?.unit})
                        </label>
                        <Input
                          placeholder={`Enter ${selectedType?.unit} (e.g., 10)`}
                          value={units}
                          onChange={(e) => setUnits(e.target.value)}
                          className="h-11 text-base"
                          type="number"
                          min="0"
                          step="0.1"
                        />
                      </div>
                      
                      <Button
                        onClick={() => mutation.mutate()}
                        className="w-full h-11 text-base font-medium"
                        disabled={mutation.isPending || !units || parseFloat(units) <= 0}
                      >
                        {mutation.isPending ? (
                          <>
                            <Clock className="mr-2 h-4 w-4 animate-spin" />
                            Tracking...
                          </>
                        ) : (
                          'Track Activity'
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
          
          {recentActivities && recentActivities.length > 0 && (
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">
                  Recent Activities
                </CardTitle>
                <CardDescription>
                  Your most recent tracked activities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentActivities.map((activity: any, index: number) => {
                    const activityType = activityTypes.find((t) => t.id === activity.type);
                    const Icon = activityType?.icon || Clock;
                    
                    return (
                      <motion.div
                        key={activity.id || index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                        className="flex items-center justify-between p-3 rounded-lg border"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="p-2 rounded-lg bg-muted">
                            <Icon className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">
                              {activityType?.name || activity.type}
                            </p>
                            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                              <span>
                                {JSON.parse(activity.details)?.units} {activityType?.unit}
                              </span>
                              <span>•</span>
                              <span>
                                {new Date(activity.timestamp).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-sm font-medium text-primary">
                          {parseFloat(activity.emissionsKg).toFixed(2)} kg
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
}