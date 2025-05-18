import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/signin?callbackUrl=/tech"); // or /mgr for managers
  // you could branch on session.user.role here
  return <>{children}</>;
}
