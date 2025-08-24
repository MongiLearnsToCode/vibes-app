// convex/functions/auth.ts
import { mutation } from "../_generated/server";
import { v } from "convex/values";

// Register a new user
export const registerUser = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if user already exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", args.email))
      .unique();
      
    if (existingUser) {
      throw new Error("User already exists with this email");
    }
    
    // Create the user
    const userId = await ctx.db.insert("users", {
      name: args.name,
      email: args.email,
      tokenIdentifier: args.email, // Using email as token identifier for now
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    
    return userId;
  },
});

// Login user
export const loginUser = mutation({
  args: {
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    // Find the user by email
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", args.email))
      .unique();
      
    if (!user) {
      throw new Error("No user found with this email");
    }
    
    // In a real implementation, we would verify the password here
    // For now, we'll just return the user ID
    return user._id;
  },
});

// Logout user
export const logoutUser = mutation({
  args: {},
  handler: async () => {
    // In a real implementation, we would invalidate the session here
    // For now, we'll just return a success message
    return { success: true };
  },
});