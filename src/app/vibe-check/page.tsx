"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/lib/convex";
import { useAuth } from "@/lib/auth-context";
import { OfflineSync, OfflineVibe } from "@/lib/offline-sync";
import { toast } from "sonner";

const moodEmojis = ["😩", "😔", "😐", "😊", "😍"];
const moodLabels = ["Awful", "Bad", "Okay", "Good", "Great"];

export default function VibeCheckPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [mood, setMood] = useState(3);
  const [note, setNote] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [relationshipId, setRelationshipId] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(true);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  // Check online status
  useEffect(() => {
    setIsOnline(navigator.onLine);
    
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // In a real implementation, we would get the relationshipId from the user's relationships
  // For now, we'll use a placeholder value
  useEffect(() => {
    if (user) {
      // Simulate fetching relationshipId
      setRelationshipId("relationship_123");
    }
  }, [user]);

  const submitVibe = useMutation(api.functions.vibes.submitVibe);
  const { vibes } = useQuery(api.functions.vibes.getVibes, { 
    relationshipId: relationshipId as any 
  }) || { vibes: [] };

  // Check if user has already submitted a vibe today
  const hasSubmittedToday = vibes && vibes.length > 0 && 
    (vibes[0].userA || vibes[0].userB) && 
    ((vibes[0].userA && vibes[0].userA.mood) || (vibes[0].userB && vibes[0].userB.mood));

  const handleSubmit = async () => {
    if (!relationshipId || !user) {
      setError("Not ready to submit. Please try again.");
      return;
    }

    // If offline, save to localStorage
    if (!isOnline) {
      OfflineSync.saveVibe({
        relationshipId,
        userId: user._id as any,
        mood,
        note,
      });
      setSubmitted(true);
      toast.success("Vibe saved offline. Will sync when online.");
      return;
    }

    try {
      await submitVibe({
        relationshipId: relationshipId as any,
        userId: user._id as any,
        mood,
        note,
      });
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred while submitting your vibe");
    }
  };

  // Try to sync offline vibes when coming online
  useEffect(() => {
    if (isOnline && user && relationshipId) {
      const syncOfflineVibes = async () => {
        const offlineVibes = OfflineSync.getOfflineVibes();
        if (offlineVibes.length === 0) return;

        toast.info(`Syncing ${offlineVibes.length} offline vibes...`);

        for (const offlineVibe of offlineVibes) {
          try {
            await submitVibe({
              relationshipId: offlineVibe.relationshipId as any,
              userId: offlineVibe.userId as any,
              mood: offlineVibe.mood,
              note: offlineVibe.note,
            });
            OfflineSync.removeVibe(offlineVibe.id);
          } catch (err) {
            console.error("Failed to sync offline vibe:", err);
          }
        }

        toast.success("Offline vibes synced successfully!");
      };

      syncOfflineVibes();
    }
  }, [isOnline, user, relationshipId, submitVibe]);

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
          <CardTitle>Daily Vibe Check</CardTitle>
          <CardDescription>Share how you're feeling today with your partner</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!isOnline && (
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4">
              <p>You are currently offline. Your vibe will be saved and synced when you're back online.</p>
            </div>
          )}
          {error && <div className="text-red-500 text-sm">{error}</div>}
          {submitted ? (
            <div className="text-center py-8">
              <h3 className="text-xl font-semibold mb-2">Vibe Submitted!</h3>
              <p className="text-muted-foreground">Thanks for sharing your vibe. Check back tomorrow!</p>
            </div>
          ) : hasSubmittedToday ? (
            <div className="text-center py-8">
              <h3 className="text-xl font-semibold mb-2">Already Submitted Today</h3>
              <p className="text-muted-foreground">You've already shared your vibe today. Check back tomorrow!</p>
            </div>
          ) : (
            <>
              <div>
                <Label className="text-lg font-semibold mb-4 block">How are you feeling today?</Label>
                <div className="flex justify-between items-center">
                  {moodEmojis.map((emoji, index) => (
                    <button
                      key={index}
                      className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
                        mood === index + 1 
                          ? "bg-primary text-primary-foreground" 
                          : "hover:bg-muted"
                      }`}
                      onClick={() => setMood(index + 1)}
                    >
                      <span className="text-3xl">{emoji}</span>
                      <span className="text-xs mt-1">{moodLabels[index]}</span>
                    </button>
                  ))}
                </div>
                <div className="text-center mt-4">
                  <span className="text-4xl">{moodEmojis[mood - 1]}</span>
                  <p className="text-lg font-medium mt-2">{moodLabels[mood - 1]}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="note">Add a note (optional)</Label>
                <Textarea
                  id="note"
                  placeholder="What's on your mind? (140 characters max)"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  maxLength={140}
                />
                <div className="text-right text-sm text-muted-foreground">
                  {note.length}/140
                </div>
              </div>
              
              <Button className="w-full" onClick={handleSubmit} disabled={!isOnline && !navigator.onLine}>
                {isOnline ? "Submit Today's Vibe" : "Save for Later"}
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}