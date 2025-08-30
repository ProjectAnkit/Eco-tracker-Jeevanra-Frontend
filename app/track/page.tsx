"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { useSession } from "next-auth/react";
// removed unused react-query imports for a cleaner file
import { motion } from "framer-motion";
import { Car, Bike, Bus, Train, Plane, Zap, Utensils, Clock } from "lucide-react";
import { toastSuccess, toastError } from "@/lib/toast";

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
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {},
  });

  // Add a loading state while session is being fetched
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  

  const selectedType = activityTypes.find((t) => t.id === type);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const trackActivity = async () => {
    if (!units || isNaN(parseFloat(units)) || parseFloat(units) <= 0) {
      setError("Please enter a valid positive number for units");
      return;
    }
    
    if (!session?.user?.id) {
      setError("User session is not valid. Please sign in again.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      if (!session?.accessToken) {
        throw new Error('No access token found in session');
      }

      const requestBody = { 
        type, 
        units: parseFloat(units),
        email: session.user.email // Include the user's email in the request body
      };
      
      const token = session.accessToken;
      
      // Make the API request with the token
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };
      
      const res = await fetch(`${API_URL}/api/track`, {
        method: 'POST',
        headers,
        body: JSON.stringify(requestBody),
      });
      
      const data = await res.json().catch(() => ({}));
      
      if (!res.ok) {
        throw new Error(data.message || `Failed to track activity: ${res.status} ${res.statusText}`);
      }
      
      toastSuccess("Activity tracked successfully!", { duration: 3000 });
      setUnits("");
    } catch (error: any) {
      console.error('Error tracking activity:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to track activity';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 md:p-5 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-5"
        >
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold tracking-tight">Track Activity</h1>
            <p className="text-sm text-muted-foreground">Log your daily eco footprint</p>
          </div>
          
          <Tabs defaultValue="commute" className="w-full">
            <TabsList className="grid w-full grid-cols-4 h-10 p-1 bg-muted/60">
              {Object.entries({
                commute: 'Commute',
                travel: 'Travel',
                home: 'Home',
                food: 'Food'
              }).map(([key, label]) => (
                <TabsTrigger 
                  key={key} 
                  value={key}
                  className="py-1.5 text-sm data-[state=active]:shadow-sm"
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
              <TabsContent key={tab} value={tab} className="mt-4">
                <Card className="border shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-semibold">
                      {category === 'commute' ? 'Transportation' : 
                       category === 'travel' ? 'Travel' : 
                       category === 'home' ? 'Home Energy' : 'Food & Diet'}
                    </CardTitle>
                    <CardDescription className="text-xs">
                      {category === 'commute' ? 'Commute' :
                       category === 'travel' ? 'Travel' :
                       category === 'home' ? 'Home usage' : 'Food footprint'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <TooltipProvider>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mb-4">
                        {activityTypes
                          .filter(activity => activity.category === category)
                          .map((activity) => (
                            <Tooltip key={activity.id}>
                              <TooltipTrigger asChild>
                                <motion.div
                                  whileHover={{ scale: 1.03 }}
                                  whileTap={{ scale: 0.98 }}
                                  onClick={() => setType(activity.id)}
                                  className={`p-3 rounded-md border cursor-pointer transition-all ${
                                    type === activity.id
                                      ? "border-primary bg-primary/5"
                                      : "border-border hover:border-primary/30"
                                  }`}
                                >
                                  <div className="flex flex-col items-center text-center space-y-1.5">
                                    <div className={`p-2 rounded-md ${
                                      type === activity.id 
                                        ? 'bg-primary/10 text-primary' 
                                        : 'bg-muted'
                                    }`}>
                                      <activity.icon className="h-4 w-4" />
                                    </div>
                                    <span className="text-xs font-medium">
                                      {activity.name}
                                    </span>
                                    <span className="text-[10px] text-muted-foreground">
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
                    
                    <div className="space-y-3 pt-2">
                      {/* Form aligned to the right with details input */}
                      <div className="flex flex-col md:flex-row md:items-end md:justify-end gap-2">
                        <div className="w-full md:w-40">
                          <label className="text-xs font-medium leading-none block mb-1">
                            {selectedType?.name} ({selectedType?.unit})
                          </label>
                          <Input
                            placeholder={`Enter ${selectedType?.unit} (e.g., 10)`}
                            value={units}
                            onChange={(e) => setUnits(e.target.value)}
                            className="h-10 text-sm"
                            type="number"
                            min="0"
                            step="0.1"
                          />
                        </div>
                        <div className="w-full md:w-64">
                          <label className="text-xs font-medium leading-none block mb-1">
                            Details (optional)
                          </label>
                          <Input
                            placeholder="Add a short note, e.g., office commute"
                            className="h-10 text-sm"
                          />
                        </div>
                        <div className="w-full md:w-auto">
                          <Button
                            onClick={trackActivity}
                            className="w-full md:w-auto h-10 text-sm font-medium"
                            disabled={isSubmitting || !units || parseFloat(units) <= 0}
                          >
                            {isSubmitting ? (
                              <>
                                <Clock className="mr-2 h-4 w-4 animate-spin" />
                                Tracking...
                              </>
                            ) : (
                              'Track Activity'
                            )}
                          </Button>
                        </div>
                      </div>
                      {error && (
                        <p className="text-red-500 text-xs">{error}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}