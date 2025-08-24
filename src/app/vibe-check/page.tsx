"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const moodEmojis = ["😩", "😔", "😐", "😊", "😍"];
const moodLabels = ["Awful", "Bad", "Okay", "Good", "Great"];

export default function VibeCheckPage() {
  const [mood, setMood] = useState(3);
  const [note, setNote] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    // In a real implementation, we would submit this to Convex
    console.log("Submitting vibe:", { mood, note });
    setSubmitted(true);
  };

  return (
    <div className="container py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Daily Vibe Check</CardTitle>
          <CardDescription>Share how you're feeling today with your partner</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {submitted ? (
            <div className="text-center py-8">
              <h3 className="text-xl font-semibold mb-2">Vibe Submitted!</h3>
              <p className="text-muted-foreground">Thanks for sharing your vibe. Check back tomorrow!</p>
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
              
              <Button className="w-full" onClick={handleSubmit}>
                Submit Today's Vibe
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}