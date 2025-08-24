"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useMutation } from "convex/react";
import { api } from "@/lib/convex";
import { useAuth } from "@/lib/auth-context";

export default function RelationshipsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [inviteCode, setInviteCode] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const createRelationship = useMutation(api.functions.relationships.createRelationship);
  const joinRelationship = useMutation(api.functions.relationships.joinRelationship);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  const handleCreateRelationship = async () => {
    if (!user) return;
    
    setIsCreating(true);
    setError("");
    setSuccess("");
    
    try {
      const result = await createRelationship({ userId: user._id as any });
      setSuccess(`Relationship created! Share this code with your partner: ${result.code}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred while creating the relationship");
    } finally {
      setIsCreating(false);
    }
  };

  const handleJoinRelationship = async () => {
    if (!user || !inviteCode) return;
    
    setIsJoining(true);
    setError("");
    setSuccess("");
    
    try {
      await joinRelationship({ userId: user._id as any, code: inviteCode });
      setSuccess("Successfully joined the relationship!");
      // Redirect to dashboard after joining
      setTimeout(() => router.push("/dashboard"), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred while joining the relationship");
    } finally {
      setIsJoining(false);
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
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Relationship Setup</CardTitle>
          <CardDescription>Connect with your partner to start sharing vibes</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && <div className="text-red-500 text-sm">{error}</div>}
          {success && <div className="text-green-500 text-sm">{success}</div>}
          
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Create a New Relationship</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Create a new relationship and get an invite code to share with your partner.
              </p>
              <Button 
                onClick={handleCreateRelationship} 
                disabled={isCreating}
                className="w-full"
              >
                {isCreating ? "Creating..." : "Create Relationship"}
              </Button>
            </div>
            
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-muted"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">or</span>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Join an Existing Relationship</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Enter an invite code from your partner to join an existing relationship.
              </p>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="inviteCode">Invite Code</Label>
                  <Input
                    id="inviteCode"
                    type="text"
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value)}
                    placeholder="Enter your invite code"
                  />
                </div>
                <Button 
                  onClick={handleJoinRelationship} 
                  disabled={isJoining || !inviteCode}
                  className="w-full"
                >
                  {isJoining ? "Joining..." : "Join Relationship"}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => router.push("/dashboard")}>
            Back to Dashboard
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}