import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    // This is automatically populated by Convex Auth
    tokenIdentifier: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_token", ["tokenIdentifier"]),

  relationships: defineTable({
    code: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_code", ["code"]),

  relationshipUsers: defineTable({
    relationshipId: v.id("relationships"),
    userId: v.id("users"),
    createdAt: v.number(),
    updatedAt: v.number(),
  }),

  vibes: defineTable({
    relationshipId: v.id("relationships"),
    userId: v.id("users"),
    mood: v.number(),
    note: v.optional(v.string()),
    date: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_relationship_and_date", ["relationshipId", "date"]),
});