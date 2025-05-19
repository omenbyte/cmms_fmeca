// app/page.tsx
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';  // named import

export default async function Home() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login');
  if (session.user?.role === 'TECH') redirect('/tech/tasks');
  redirect('/manager/dashboard');
}
