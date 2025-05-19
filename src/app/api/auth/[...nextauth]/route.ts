// app/api/auth/[...nextauth]/route.ts
import NextAuth, { type NextAuthOptions } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {          // ← named export
    session : {strategy: 'jwt'},
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {                   // rename for clarity
        if (!credentials) return null;                 // ← fixes “possibly undefined”
        const user = await prisma.user.findUnique({
          where: { username: credentials.username }
        });
        if (user && bcrypt.compareSync(credentials.password, user.password)) {
          return { id: user.id, name: user.username, role: user.role };
        }
        return null;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = user.role;
      return token;
    },
    async session({ session, token }) {
      if (session.user) session.user.role = token.role as string; // safe‑guard
      return session;
    }
  },
  pages: { signIn: '/login' }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
