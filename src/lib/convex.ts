// src/lib/convex.ts
import { ConvexReactClient } from "convex/react";
import { api } from "../../convex/_generated/api";

// Create a Convex client instance
const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export { convex, api };