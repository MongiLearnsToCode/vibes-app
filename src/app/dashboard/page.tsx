"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "convex/react";
import { api } from "@/lib/convex";
import { useAuth } from "@/lib/auth-context";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";

export default function DashboardPage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [relationshipId, setRelationshipId] = useState<string | null>(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  // In a real implementation, we would get the relationshipId from the user's relationships
  // For now, we'll use a placeholder value
  useEffect(() => {
    if (user) {
      // Simulate fetching relationshipId
      setRelationshipId("relationship_123");
    }
  }, [user]);

  const { vibes, users } = useQuery(api.functions.vibes.getVibes, { 
    relationshipId: relationshipId as any 
  }) || { vibes: [], users: [] };

  // Prepare data for the chart
  const chartData = vibes && vibes.length > 0 ? vibes.map(vibe => ({
    date: vibe.date,
    userA: vibe.userA?.mood || 0,
    userB: vibe.userB?.mood || 0,
  })).filter(item => item.userA > 0 || item.userB > 0) : [];

  // Generate a static insight
  const generateInsight = () => {
    if (!vibes || vibes.length === 0) {
      return "Start sharing vibes with your partner to see insights!";
    }
    
    // Simple insight generation based on recent moods
    const recentVibes = vibes.slice(0, 3);
    const userAVibes = recentVibes.map(v => v.userA?.mood).filter(Boolean) as number[];
    const userBVibes = recentVibes.map(v => v.userB?.mood).filter(Boolean) as number[];
    
    const userAAvg = userAVibes.length > 0 ? userAVibes.reduce((a, b) => a + b, 0) / userAVibes.length : 0;
    const userBAvg = userBVibes.length > 0 ? userBVibes.reduce((a, b) => a + b, 0) / userBVibes.length : 0;
    
    if (userAAvg >= 4 && userBAvg >= 4) {
      return "You're both feeling great this week! Keep up the positive energy.";
    } else if (userAAvg <= 2 && userBAvg <= 2) {
      return "It seems like you're both having a tough time. Consider checking in with each other.";
    } else if (Math.abs(userAAvg - userBAvg) >= 2) {
      return "You and your partner seem to be experiencing different emotions lately. Communication is key!";
    } else {
      return "You're both feeling balanced this week. Keep maintaining this harmony!";
    }
  };

  const insight = generateInsight();

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Your Vibes Dashboard</h1>
        <Button onClick={handleLogout}>Logout</Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Today's Vibes</CardTitle>
            <CardDescription>Share how you're feeling today</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" onClick={() => router.push("/vibe-check")}>
              Share Today's Vibe
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>7-Day Mood Chart</CardTitle>
            <CardDescription>Your mood trends over time</CardDescription>
          </CardHeader>
          <CardContent>
            {chartData.length > 0 ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={chartData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[1, 5]} />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="userA" 
                      name="Your Mood" 
                      stroke="#8884d8" 
                      activeDot={{ r: 8 }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="userB" 
                      name="Partner's Mood" 
                      stroke="#82ca9d" 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center">
                <p>No mood data yet. Start by sharing your first vibe!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Weekly Insight</CardTitle>
          <CardDescription>Your relationship mood snapshot</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-lg">{insight}</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Recent Vibes</CardTitle>
          <CardDescription>Your last 7 days of vibes</CardDescription>
        </CardHeader>
        <CardContent>
          {vibes && vibes.length > 0 ? (
            <div className="space-y-4">
              {vibes.map((vibe, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="font-medium">{vibe.date}</div>
                  <div className="flex space-x-4">
                    <div>
                      <div>User A</div>
                      {vibe.userA ? (
                        <div className="flex items-center">
                          <span className="text-2xl">
                            {["😩", "😔", "😐", "😊", "😍"][vibe.userA.mood - 1]}
                          </span>
                          {vibe.userA.note && <span className="ml-2 text-sm">"{vibe.userA.note}"</span>}
                        </div>
                      ) : (
                        <div className="text-muted-foreground">No vibe yet</div>
                      )}
                    </div>
                    <div>
                      <div>User B</div>
                      {vibe.userB ? (
                        <div className="flex items-center">
                          <span className="text-2xl">
                            {["😩", "😔", "😐", "😊", "😍"][vibe.userB.mood - 1]}
                          </span>
                          {vibe.userB.note && <span className="ml-2 text-sm">"{vibe.userB.note}"</span>}
                        </div>
                      ) : (
                        <div className="text-muted-foreground">No vibe yet</div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No vibes yet. Start by sharing your first vibe!</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}