import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/app/(backend)/lib/db";
import { verifyPassword } from "@/app/(backend)/lib/auth";

const handler = NextAuth({
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        // Find user by username and include related lecturer data
        const user = await prisma.user.findUnique({
          where: {
            username: credentials.username,
          },
          include: {
            lecturer: true, // Include related lecturer data
          },
        });

        if (!user) {
          throw new Error("No user found!");
        }

        const isValid = await verifyPassword(
          credentials.password,
          user.password
        );

        if (!isValid) {
          throw new Error("Username and password didn't match");
        }

        const currentUser = {
          id: user.id,
          username: user.username,
          userRole: user.userRole,
          lecturer: user.lecturer, // Include lecturer information
        };

        return currentUser;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token.user;
      return session;
    },
  },
  pages: {
    signIn: "/",
  },
});

export { handler as GET, handler as POST };
