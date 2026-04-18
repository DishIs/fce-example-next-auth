import NextAuth, { CredentialsSignin } from "next-auth"
import "next-auth/jwt"
import Credentials from "next-auth/providers/credentials"

const otpStore = new Map<string, { otp: string; expires: number }>()

class OTPSentError extends CredentialsSignin {
  code = "OTP_SENT"
  constructor() {
    super("OTP sent")
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  theme: { logo: "https://authjs.dev/img/logo-sm.png" },
  providers: [
    Credentials({
      name: "Email & OTP",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "demo@example.com" },
        password: { label: "Password", type: "password" },
        otp: { label: "OTP", type: "text", placeholder: "Leave blank to get an OTP" }
      },
      async authorize(credentials) {
        const email = credentials?.email as string;
        const password = credentials?.password as string;
        const otp = credentials?.otp as string;

        if (!email || !password) throw new CredentialsSignin("Email and Password are required");

        // Basic password check (for demo)
        if (password !== "Str0ng!Pass#99") throw new CredentialsSignin("Invalid password");

        if (!otp) {
          // Generate a 6-digit random OTP code
          const newOtp = Math.floor(100000 + Math.random() * 900000).toString();

          // Store OTP in memory for test purposes (5 min expiry)
          otpStore.set(email, { otp: newOtp, expires: Date.now() + 300000 });

          // Send OTP via Resend API
          const res = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${process.env.AUTH_RESEND_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              from: process.env.EMAIL_FROM || "onboarding@resend.dev",
              to: email,
              subject: "Sign in to Your App",
              html: `<p>Your One-Time Password (OTP) to sign in is: <strong>${newOtp}</strong></p>`,
            }),
          });

          if (!res.ok) {
            throw new Error("Failed to send OTP. Please check your Resend configuration.");
          }

          // Throwing an error stops login but displays this message to the user
          throw new OTPSentError();
        }

        // Verify the OTP
        const stored = otpStore.get(email);
        
        if (stored && stored.otp === otp && stored.expires > Date.now()) {
          // Clear OTP after successful login
          otpStore.delete(email);
          
          return {
            id: email,
            name: email.split("@")[0],
            email: email,
          }
        }

        throw new CredentialsSignin("Invalid or expired OTP");
      }
    })
  ],
  pages: {
    signIn: "/auth/signin",
  },
  session: { strategy: "jwt" },
  callbacks: {
    authorized({ request, auth }) {
      const { pathname } = request.nextUrl
      if (pathname === "/middleware-example") return !!auth
      return true
    },
    jwt({ token, trigger, session }) {
      if (trigger === "update" && session?.user?.name) {
        token.name = session.user.name
      }
      return token
    },
    async session({ session, token }) {
      if (token?.accessToken) session.accessToken = token.accessToken
      return session
    },
  },
})

declare module "next-auth" {
  interface Session {
    accessToken?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string
  }
}
