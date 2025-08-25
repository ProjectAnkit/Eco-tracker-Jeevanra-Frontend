"use client";

import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL;

export default function Profile() {
  const { data: session } = useSession();
  const [location, setLocation] = useState("");

  const handleUpdate = async () => {
    const res = await fetch(`${API_URL}/api/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.accessToken}`,
      },
      body: JSON.stringify({ location }),
    });
    if (res.ok) alert("Profile updated!");
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <Card className="bg-secondary border-none max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p>Email: {session?.user?.email}</p>
            <Input
              placeholder="Location (e.g., New York)"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="bg-gray-700 border-none"
            />
            <Button onClick={handleUpdate} className="w-full bg-primary hover:bg-green-600">
              Update Profile
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}