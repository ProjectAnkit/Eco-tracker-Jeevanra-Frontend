"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL;

export default function Challenges() {
  const { data: session } = useSession();

  const { data: challenges } = useQuery({
    queryKey: ["challenges"],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/challenges`, {
        headers: { Authorization: `Bearer ${session?.accessToken}` },
      });
      return res.json();
    },
    enabled: !!session,
  });

  return (
    <div className="min-h-screen bg-background p-6">
      <Card className="bg-secondary border-none">
        <CardHeader>
          <CardTitle>Community Challenges</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Goal (kg CO2)</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {challenges?.map((challenge: any) => (
                <TableRow key={challenge.id}>
                  <TableCell>{challenge.name}</TableCell>
                  <TableCell>{challenge.goal}</TableCell>
                  <TableCell>
                    <Button className="bg-primary hover:bg-green-600">Join</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}