'use client';
import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";

const qc = new QueryClient();

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <QueryClientProvider client={qc}>{children}</QueryClientProvider>
    </SessionProvider>
  );
}
