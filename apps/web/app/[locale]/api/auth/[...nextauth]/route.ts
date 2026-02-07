import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  callbacks: {
  jwt: async ({ token, account, profile }) => {
    console.log("JWT callback:", { token, account, profile });
    if (account && profile) {
      token.id = profile.sub;
      token.name = profile.name;
      token.email = profile.email;
      token.picture = profile.picture;
    }
    return token;
  },
  session: async ({ session, token }) => {
    console.log("Session callback:", { session, token });
    session.user.id = token.id;
    session.user.name = token.name;
    session.user.email = token.email;
    session.user.image = token.picture;
    return session;
  },
}

});

export { handler as GET, handler as POST };
