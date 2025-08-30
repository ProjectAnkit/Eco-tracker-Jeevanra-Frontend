"use client";

import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { 
  User, 
  MapPin, 
  Edit3, 
  Save, 
  X, 
  Camera, 
  Award, 
  Leaf,
  Calendar,
  Mail
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL;

interface UserProfile {
  id: number;
  email: string;
  name: string;
  avatar: string;
  location: string;
  bio: string;
  points: number;
  co2Saved: number;
}

export default function Profile() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    avatar: "",
    location: "",
    bio: ""
  });

  useEffect(() => {
    if (session?.user?.email) {
      loadProfile();
    }
  }, [session]);

  const loadProfile = async () => {
    try {
      const res = await fetch(`${API_URL}/api/profile?email=${encodeURIComponent(session!.user!.email!)}`, {
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
      });
      
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
        setFormData({
          name: data.name || "",
          avatar: data.avatar || "",
          location: data.location || "",
          bio: data.bio || ""
        });
      }
    } catch (error) {
      console.error("Error loading profile:", error);
      toast.error("Failed to load profile");
    }
  };

  const handleUpdate = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`${API_URL}/api/profile?email=${encodeURIComponent(session!.user!.email!)}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.accessToken}`,
        },
        body: JSON.stringify({
          ...formData
        }),
      });
      
      if (res.ok) {
        toast.success("Profile updated successfully!");
        setIsEditing(false);
        await loadProfile(); // Reload profile
      } else {
        toast.error("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: profile?.name || "",
      avatar: profile?.avatar || "",
      location: profile?.location || "",
      bio: profile?.bio || ""
    });
    setIsEditing(false);
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-cyan-50 dark:from-slate-900 dark:via-emerald-900/30 dark:to-cyan-900/20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Please sign in</h1>
          <p className="text-slate-600 dark:text-slate-400">You need to be signed in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-cyan-50 dark:from-slate-900 dark:via-emerald-900/30 dark:to-cyan-900/20 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-slate-800 dark:text-white mb-1.5">
            Your Eco Profile
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
            Manage your personal information and track your sustainability journey
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
          {/* Left Sidebar - Profile Card */}
          <div className="lg:col-span-1 space-y-5">
            <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-slate-200/80 dark:border-slate-700/50 shadow-sm hover:shadow-md transition-all duration-200">
              <CardContent className="p-4">
                <div className="flex flex-col items-center text-center space-y-3.5">
                  {/* Avatar Section */}
                  <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full opacity-70 group-hover:opacity-90 blur transition-all duration-200"></div>
                    <div className="relative">
                      <Avatar className="w-20 h-20 border-[3px] border-white dark:border-slate-800 shadow-sm">
                        {(() => {
                          const imgSrc = isEditing ? formData.avatar : profile?.avatar;
                          return imgSrc ? (
                            <AvatarImage src={imgSrc} alt={profile?.name || "User"} className="object-cover" />
                          ) : null;
                        })()}
                        <AvatarFallback className="text-xl font-medium bg-gradient-to-br from-emerald-500 to-cyan-500 text-white">
                          {profile?.name ? profile.name.charAt(0).toUpperCase() : session.user?.email?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      {isEditing && (
                        <Button
                          size="icon"
                          className="absolute -bottom-1 -right-1 rounded-full w-7 h-7 bg-emerald-500 hover:bg-emerald-600 transition-all duration-200 shadow-sm hover:scale-105"
                          onClick={() => document.getElementById('avatar-input')?.click()}
                        >
                          <Camera className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
                    <input
                      id="avatar-input"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            const base64 = reader.result as string;
                            setFormData(prev => ({ ...prev, avatar: base64 }));
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </div>

                  {/* Name */}
                  <div className="w-full pt-1">
                    {isEditing ? (
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Your name"
                        className="text-center text-[15px] font-medium border-slate-200 dark:border-slate-700 focus:border-emerald-500 h-9 bg-white/70 dark:bg-slate-800/70 hover:bg-white dark:hover:bg-slate-800/90 transition-colors"
                      />
                    ) : (
                      <h2 className="text-[15px] font-medium text-slate-800 dark:text-white">
                        {profile?.name || "Anonymous User"}
                      </h2>
                    )}
                  </div>

                  {/* Email */}
                  <div className="flex items-center justify-center space-x-1.5 text-slate-500 dark:text-slate-400 text-sm">
                    <Mail className="h-3.5 w-3.5" />
                    <span className="truncate max-w-[180px]">{session.user?.email}</span>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-2 w-full pt-1.5">
                    <div className="text-center p-2 bg-slate-50/80 dark:bg-slate-800/50 rounded-md border border-slate-200/70 dark:border-slate-700/50">
                      <div className="text-[13px] font-medium text-emerald-600 dark:text-emerald-400">
                        {profile?.points || 0}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Points</div>
                    </div>
                    <div className="text-center p-2 bg-slate-50/80 dark:bg-slate-800/50 rounded-md border border-slate-200/70 dark:border-slate-700/50">
                      <div className="text-[13px] font-medium text-cyan-600 dark:text-cyan-400">
                        {profile?.co2Saved?.toFixed(1) || "0.0"}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">CO₂ Saved</div>
                    </div>
                  </div>

                  {/* Edit/Save Buttons */}
                  <div className="pt-2.5 flex flex-col space-y-2 w-full">
                    {isEditing ? (
                      <div className="flex flex-col space-y-2.5">
                        <Button 
                          className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white text-[13px] h-9 font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                          onClick={handleUpdate}
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <span className="flex items-center">
                              <svg className="animate-spin -ml-1 mr-2 h-3.5 w-3.5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Saving...
                            </span>
                          ) : 'Save Changes'}
                        </Button>
                        <Button 
                          variant="outline" 
                          className="border-slate-300 text-slate-700 dark:text-slate-300 dark:border-slate-600 text-[13px] h-9 font-medium hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
                          onClick={handleCancel}
                          disabled={isLoading}
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <Button 
                        variant="outline" 
                        className="group border-emerald-500/40 text-emerald-600 hover:bg-emerald-50 dark:text-emerald-400 dark:border-emerald-600/40 dark:hover:bg-emerald-900/20 text-[13px] h-9 font-medium flex items-center justify-center transition-all hover:border-emerald-500 hover:shadow-sm"
                        onClick={() => setIsEditing(true)}
                      >
                        <Edit3 className="h-3.5 w-3.5 mr-1.5 transition-transform group-hover:rotate-[-5deg]" />
                        Edit Profile
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

       
          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-5">
            {/* Personal Information Card */}
            <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-slate-200/80 dark:border-slate-700/50 shadow-sm hover:shadow-md transition-all duration-200">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-cyan-500"></div>
              <CardHeader className="pb-3 px-6 pt-5 border-b border-slate-200/80 dark:border-slate-700/50">
                <CardTitle className="text-[15px] font-semibold text-slate-800 dark:text-white flex items-center">
                  <User className="h-4 w-4 mr-2 text-emerald-500" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Location */}
                  <div className="space-y-1.5">
                    <Label htmlFor="location" className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center">
                      <MapPin className="h-3.5 w-3.5 mr-1.5 text-emerald-500 flex-shrink-0" />
                      Location
                    </Label>
                    {isEditing ? (
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                        placeholder="e.g., New York, NY"
                        className="text-sm h-9 border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-800/70 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 hover:bg-white dark:hover:bg-slate-800/90 transition-colors"
                      />
                    ) : (
                      <div className="px-3 py-2 text-sm bg-white/70 dark:bg-slate-800/70 rounded-md border border-slate-200/80 dark:border-slate-700/50 min-h-[36px] flex items-center">
                        {profile?.location || <span className="text-slate-400 dark:text-slate-500 italic">No location set</span>}
                      </div>
                    )}
                  </div>

                  {/* Email (Read-only) */}
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center">
                      <Mail className="h-3.5 w-3.5 mr-1.5 text-emerald-500 flex-shrink-0" />
                      Email Address
                    </Label>
                    <div className="px-3 py-2 text-sm bg-slate-50/70 dark:bg-slate-800/50 rounded-md border border-slate-200/80 dark:border-slate-700/50 text-slate-700 dark:text-slate-300 min-h-[36px] flex items-center">
                      {session.user?.email}
                    </div>
                  </div>

                  {/* Bio (Full width) */}
                  <div className="space-y-1.5 md:col-span-2">
                    <Label htmlFor="bio" className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center">
                      <Edit3 className="h-3.5 w-3.5 mr-1.5 text-emerald-500 flex-shrink-0" />
                      About You
                    </Label>
                    {isEditing ? (
                      <Textarea
                        id="bio"
                        value={formData.bio}
                        onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                        placeholder="Tell us about yourself and your eco-goals..."
                        rows={4}
                        className="text-sm border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-800/70 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 resize-none hover:bg-white dark:hover:bg-slate-800/90 transition-colors"
                      />
                    ) : (
                      <div className="p-3 text-sm bg-white/70 dark:bg-slate-800/70 rounded-md border border-slate-200/80 dark:border-slate-700/50 min-h-[120px]">
                        {profile?.bio || <span className="text-slate-400 dark:text-slate-500 italic">No bio added yet. Share your story!</span>}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}