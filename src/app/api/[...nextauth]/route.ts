import NextAuth, { type NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { Role } from "@prisma/client";
import type { JWT } from "next-auth/jwt";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(creds) {
        if (!creds?.email || !creds.password) return null;
        const user = await prisma.user.findUnique({ where: { email: creds.email } });
        if (!user) return null;
        if (!bcrypt.compareSync(creds.password, user.password)) return null;
        return { ...user, id: String(user.id) };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = (user as unknown as { id: number }).id;
        token.role = (user as { role: Role }).role;
      }
      return token;
    },
    session({ session, token }) {
      const t = token as JWT & { id?: number; role?: Role };
      if (session.user && t.id && t.role) {
        session.user.id = t.id;
        session.user.role = t.role;
      }
      return session;
    },
  },
  pages: { signIn: "/signin" },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
