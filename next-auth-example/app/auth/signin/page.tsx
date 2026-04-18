"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const router = useRouter();

  const handleInitialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Use the backend to send OTP. 
    // We can call signIn, and if it fails with 'OTP sent', we move to step 2.
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    
    console.log("signIn result:", JSON.stringify(res));
    
    if (res?.error) {
      setStep(2);
    } else if (res?.ok && !res?.error) {
      window.location.href = "/dashboard";
    } else {
      alert("Result: " + JSON.stringify(res));
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await signIn("credentials", {
      email,
      password,
      otp,
      redirect: false,
    });

    if (res?.ok && !res?.error) {
      // Use window.location for full page reload to ensure session is set
      window.location.href = "/dashboard";
    } else {
      alert("Error: " + res?.error);
    }
  };

  return (
    <div style={{ padding: "50px" }}>
      <h1>Sign In</h1>
      {step === 1 ? (
        <form onSubmit={handleInitialSubmit}>
          <div>
            <label>Email</label>
            <input name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <label>Password</label>
            <input name="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit">Send OTP</button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp}>
          <div>
            <label>OTP</label>
            <input name="otp" type="text" value={otp} onChange={(e) => setOtp(e.target.value)} required />
          </div>
          <button type="submit" data-testid="verify-btn">Verify OTP</button>
        </form>
      )}
    </div>
  );
}
