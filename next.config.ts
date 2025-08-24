import type { NextConfig } from "next";
import withPWA from "next-pwa";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
};

export default withPWA({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
  manifest: {
    name: "Relationship Vibe App",
    short_name: "Vibe App",
    description: "Share daily moods with your partner",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
  },
})(nextConfig);
