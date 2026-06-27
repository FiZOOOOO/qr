import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "SUPER_ADMIN" | "DEALER" | "BUSINESS";
    } & DefaultSession["user"];
  }
  interface User {
    role: "SUPER_ADMIN" | "DEALER" | "BUSINESS";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "SUPER_ADMIN" | "DEALER" | "BUSINESS";
  }
}
