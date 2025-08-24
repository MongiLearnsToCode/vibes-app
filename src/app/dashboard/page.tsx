"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "convex/react";
import { api } from "@/lib/convex";
import { useAuth } from "@/lib/auth-context";

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
            <div className="h-64 flex items-center justify-center">
              <p>Chart will appear here</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
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