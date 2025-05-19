// app/layout.tsx
import Link from 'next/link';
import Providers from './providers';
import './globals.css';

export const metadata = { title: 'CMMS‑FMECA PoC' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body className="min-h-screen">
        <Providers> {/* ← gives useQuery a client */}
          <header className="bg-gray-800 text-white p-3 flex gap-4">
            <Link href="/">Home</Link>
            <Link href="/tech/tasks">Tasks</Link>
            <Link href="/manager/dashboard">Dashboard</Link>
          </header>
          {children}
        </Providers>
      </body>
    </html>
  );
}
