import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { writeClient } from "@/lib/sanity.write";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {},
        password: {},
      },  
      async authorize(credentials) {
        const user = await writeClient.fetch(
          `*[_type == "user" && email == $email][0]`,
          { email: credentials?.email }
        );

        if (user && await bcrypt.compare(credentials!.password, user.password)) {
          return {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
          };
        }

        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) session.user.role = token.role;
      return session;
    },
  },
});

export { handler as GET, handler as POST };
