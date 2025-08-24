// convex/functions/relationships.ts
import { mutation, query } from "../_generated/server";
import { v } from "convex/values";
import { Id } from "../_generated/dataModel";

// Create a new relationship and generate an invite code
export const createRelationship = mutation({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    // Generate a unique invite code
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    // Create the relationship
    const relationshipId = await ctx.db.insert("relationships", {
      code,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    
    // Link the user to the relationship
    await ctx.db.insert("relationshipUsers", {
      relationshipId,
      userId: args.userId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    
    return { relationshipId, code };
  },
});

// Join a relationship using an invite code
export const joinRelationship = mutation({
  args: {
    userId: v.id("users"),
    code: v.string(),
  },
  handler: async (ctx, args) => {
    // Find the relationship by code
    const relationship = await ctx.db
      .query("relationships")
      .withIndex("by_code", (q) => q.eq("code", args.code))
      .unique();
      
    if (!relationship) {
      throw new Error("Invalid invite code");
    }
    
    // Check if the user is already in this relationship
    const existingLink = await ctx.db
      .query("relationshipUsers")
      .filter((q) => 
        q.and(
          q.eq(q.field("relationshipId"), relationship._id),
          q.eq(q.field("userId"), args.userId)
        )
      )
      .unique();
      
    if (existingLink) {
      throw new Error("User is already in this relationship");
    }
    
    // Check if the relationship already has two users
    const usersInRelationship = await ctx.db
      .query("relationshipUsers")
      .filter((q) => q.eq(q.field("relationshipId"), relationship._id))
      .collect();
      
    if (usersInRelationship.length >= 2) {
      throw new Error("This relationship already has two users");
    }
    
    // Link the user to the relationship
    await ctx.db.insert("relationshipUsers", {
      relationshipId: relationship._id,
      userId: args.userId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    
    return relationship._id;
  },
});