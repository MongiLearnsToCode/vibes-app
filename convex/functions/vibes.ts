// convex/functions/vibes.ts
import { mutation, query } from "../_generated/server";
import { v } from "convex/values";
import { Id } from "../_generated/dataModel";

// Submit a daily vibe (mood + note)
export const submitVibe = mutation({
  args: {
    relationshipId: v.id("relationships"),
    userId: v.id("users"),
    mood: v.number(),
    note: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Validate mood is between 1 and 5
    if (args.mood < 1 || args.mood > 5) {
      throw new Error("Mood must be between 1 and 5");
    }
    
    // Validate note length if provided
    if (args.note && args.note.length > 140) {
      throw new Error("Note must be 140 characters or less");
    }
    
    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];
    
    // Check if user has already submitted a vibe today
    const existingVibe = await ctx.db
      .query("vibes")
      .withIndex("by_relationship_and_date", (q) => 
        q.eq("relationshipId", args.relationshipId).eq("date", today)
      )
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .unique();
      
    if (existingVibe) {
      throw new Error("You have already submitted a vibe today");
    }
    
    // Submit the vibe
    const vibeId = await ctx.db.insert("vibes", {
      relationshipId: args.relationshipId,
      userId: args.userId,
      mood: args.mood,
      note: args.note,
      date: today,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    
    return vibeId;
  },
});

// Get vibes for today and last 7 days
export const getVibes = query({
  args: {
    relationshipId: v.id("relationships"),
  },
  handler: async (ctx, args) => {
    // Get dates for today and last 7 days
    const dates: string[] = [];
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      dates.push(date.toISOString().split('T')[0]);
    }
    
    // Get vibes for these dates
    const vibes = await ctx.db
      .query("vibes")
      .withIndex("by_relationship_and_date", (q) => 
        q.eq("relationshipId", args.relationshipId)
      )
      .collect();
    
    // Filter vibes by date
    const filteredVibes = vibes.filter(vibe => dates.includes(vibe.date));
    
    // Get users in the relationship
    const relationshipUsers = await ctx.db
      .query("relationshipUsers")
      .filter((q) => q.eq(q.field("relationshipId"), args.relationshipId))
      .collect();
      
    const userIds = relationshipUsers.map(ru => ru.userId);
    
    // Get user details
    const users = await Promise.all(
      userIds.map(async (userId) => {
        const user = await ctx.db.get(userId);
        return user ? { id: user._id, name: user.name } : null;
      })
    );
    
    // Format response
    const result = dates.map(date => {
      const dateVibes = filteredVibes.filter(vibe => vibe.date === date);
      
      const userAVibe = dateVibes.find(vibe => vibe.userId === userIds[0]);
      const userBVibe = dateVibes.find(vibe => vibe.userId === userIds[1]);
      
      return {
        date,
        userA: userAVibe ? { mood: userAVibe.mood, note: userAVibe.note } : null,
        userB: userBVibe ? { mood: userBVibe.mood, note: userBVibe.note } : null,
      };
    });
    
    return {
      vibes: result,
      users: users.filter(user => user !== null),
    };
  },
});