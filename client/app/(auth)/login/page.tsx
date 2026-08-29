"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GoogleLogin } from "@react-oauth/google";
import { usePopup } from "@/components/Popup/PopupContext";
import { Eye, EyeOff } from "lucide-react";
import Logo from "../../../public/logoSVG.png"
import Image from "next/image";
import ThemeToggle from "@/components/ThemeToggle";
import backgroundImage from "@/assets/ProfileIcons/Midnight Teal to Mint Glow.png";

function LoginPage() {
  const router = useRouter();
  const { showPopup } = usePopup();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      showPopup("Please fill in all fields", "error");
      return;
    }

    setLoading(true);
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000/api";
      const response = await fetch(`${backendUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Save token to cookies
        document.cookie = `token=${data.token}; path=/; max-age=604800; SameSite=Lax`;
        showPopup("Login successful! Welcome back.", "success");
        router.push("/");
      } else {
        showPopup(data.message || "Invalid credentials", "error");
      }
    } catch (error) {
      console.error("Login error:", error);
      showPopup("Failed to login. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000/api";
      const response = await fetch(`${backendUrl}/auth/google`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idToken: credentialResponse.credential }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        document.cookie = `token=${data.token}; path=/; max-age=604800; SameSite=Lax`;
        showPopup("Google authentication successful!", "success");
        router.push("/");
      } else {
        showPopup(data.message || "Google auth failed", "error");
      }
    } catch (error) {
      console.error("Google auth error:", error);
      showPopup("Failed to authenticate with Google", "error");
    }
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center bg-black p-4 font-sans text-slate-800 transition-colors duration-300 dark:bg-zinc-950 dark:text-zinc-200"

      style={{
        backgroundImage: `url('${backgroundImage.src}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Floating Theme Toggle */}
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle scrolled={false} />
      </div>

      <div className="flex w-full max-w-4xl flex-col overflow-hidden rounded-xl p-2 border border-slate-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xl md:flex-row min-h-[550px] transition-colors duration-300">

        {/* Left Panel */}
        <div className="relative flex w-full justify-center items-center rounded-t-lg md:rounded-l-lg md:rounded-tr-none
            bg-black
            bg-[radial-gradient(ellipse_70%_55%_at_50%_100%,rgba(225,244,238,0.9)_0%,rgba(142,205,170,0.7)_25%,rgba(41,174,174,0.45)_48%,transparent_75%),radial-gradient(ellipse_90%_65%_at_55%_80%,rgba(27,178,183,0.8)_0%,rgba(16,108,125,0.55)_40%,transparent_75%),linear-gradient(to_bottom,#000000_0%,#0b1720_25%,#103b46_48%,#1a777d_72%,#9bc8af_100%)]
           p-8 md:p-10 text-white w-full md:w-5/12 min-h-[160px] md:min-h-full">
          {/* Logo */}
          <Link href="/" className="flex items-center justify-center gap-2">
            <Image
              className="w-12 h-12 md:w-14 md:h-14 invert transition-transform duration-300 hover:scale-105"
              src={Logo}
              alt="Archer logo"
              width={56}
              height={56}
              priority
            />

            <p className="text-2xl font-semibold tracking-wide">Archer</p>
          </Link>
        </div>

        {/* Right Panel */}
        <div className="flex w-full flex-col justify-center p-8 sm:p-12 md:w-7/12 bg-white dark:bg-zinc-900 transition-colors duration-300">
          <div className="mb-8">
            {/* <Image className="w-10 h-10" src={Logo} alt="archer-logo"/> */}
            <h1 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
              Welcome back
            </h1>
            <p className="mt-2 text-sm text-slate-500 dark:text-zinc-400">
              Good to have you back here!
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Email Field */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-600 dark:text-zinc-400">
                Your email
              </label>
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-800/50 px-4 py-2.5 text-sm text-slate-800 dark:text-zinc-200 focus:border-slate-900 dark:focus:border-zinc-100 focus:bg-white dark:focus:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 dark:focus:ring-zinc-100/10 transition-all"
              />
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-600 dark:text-zinc-400">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-800/50 pl-4 pr-11 py-2.5 text-sm text-slate-800 dark:text-zinc-200 focus:border-slate-900 dark:focus:border-zinc-100 focus:bg-white dark:focus:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 dark:focus:ring-zinc-100/10 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500 hover:text-slate-600 dark:hover:text-zinc-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full rounded-lg bg-slate-900 dark:bg-teal-600 py-3 text-sm font-semibold text-white dark:text-white hover:bg-slate-800 dark:hover:bg-teal-500 active:bg-slate-950 dark:active:bg-teal-700 transition-colors shadow-md disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* Social Divider */}
          <div className="my-6 flex items-center justify-between text-xs text-slate-400 dark:text-zinc-500">
            <span className="h-px w-[30%] bg-slate-200 dark:bg-zinc-800" />
            <span>or continue with</span>
            <span className="h-px w-[30%] bg-slate-200 dark:bg-zinc-800" />
          </div>

          {/* Google Button */}
          <div className="flex justify-center w-full min-h-[44px]">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => showPopup("Google Sign-In failed", "error")}
              theme={isDark ? "filled_black" : "outline"}
              size="large"
              width="300"
              text="continue_with"
              use_fedcm_for_button={true}
            />
          </div>

          {/* Switch page link */}
          <p className="mt-8 text-center text-xs text-slate-500 dark:text-zinc-400">
            Don't have an account?{" "}
            <Link
              href="/signup"
              className="font-semibold text-blue-700 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
            >
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;