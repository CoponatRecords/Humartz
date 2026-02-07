import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { 
  handlers, 
  auth,     // This is the actual function that will be called in layout.tsx
  signIn, 
  signOut 
} = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  // Optional: Add session strategy if needed
  session: { strategy: "jwt" },
});