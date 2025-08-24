"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Your Vibes Dashboard</h1>
        <Button>Logout</Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Today's Vibes</CardTitle>
            <CardDescription>Share how you're feeling today</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Your vibe check will appear here</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>7-Day Mood Chart</CardTitle>
            <CardDescription>Your mood trends over time</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Your mood chart will appear here</p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Recent Vibes</CardTitle>
          <CardDescription>Your last 7 days of vibes</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Your recent vibes will appear here</p>
        </CardContent>
      </Card>
    </div>
  );
}