import Link from 'next/link';
import './globals.css';

export const metadata = { title: 'CMMS FMECA PoC' };

export default function RootLayout({ children }:{children:React.ReactNode}){
  return (
    <html>
      <body className="min-h-screen">
        <header className="bg-gray-800 text-white p-3 flex gap-4">
          <Link href="/">Home</Link>
          <Link href="/tech/tasks">Tasks</Link>
          <Link href="/manager/dashboard">Dashboard</Link>
        </header>
        {children}
      </body>
    </html>
  );
}
