"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // In a real implementation, we would check if the user is logged in
    // For now, we'll redirect to the signup page
    router.push("/signup");
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p>Redirecting...</p>
    </div>
  );
}
