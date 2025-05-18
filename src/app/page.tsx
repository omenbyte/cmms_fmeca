// src/app/page.tsx
"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;          // wait for auth check
    if (!session) {
      router.replace("/signin");              // not logged in → sign in
    } else if (session.user.role === "MANAGER") {
      router.replace("/mgr");
    } else {
      router.replace("/tech");
    }
  }, [status, session, router]);

  return null; // nothing to render while redirecting
}
