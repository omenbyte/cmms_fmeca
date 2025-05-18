import { Role } from "@prisma/client";

declare module "next-auth" {
  interface User {
    role: Role;
  }
  interface Session {
    user: {
      id: number;
      email: string;
      role: Role;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: number;
    role: Role;
  }
}
