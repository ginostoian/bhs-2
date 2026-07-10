"use client";

import Image from "next/image";
import Link from "next/link";
import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Eye, EyeOff, Loader2, ShieldCheck } from "lucide-react";
import { toast } from "react-hot-toast";
import config from "@/config";

function GoogleIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedRole = searchParams.get("role");
  const isReferrerSignUp = requestedRole === "referrer";
  const callbackUrl =
    searchParams.get("callbackUrl") ||
    (isReferrerSignUp ? "/referrer" : config.auth.callbackUrl);

  const [mode, setMode] = useState(isReferrerSignUp ? "signup" : "signin");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });

  const isSignUp = mode === "signup";
  const isSetPassword = mode === "password";

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const result = await signIn("google", { callbackUrl, redirect: false });
      if (result?.error) {
        toast.error("Google sign in failed. Please try again.");
      } else if (result?.ok) {
        router.push(callbackUrl);
      }
    } catch (error) {
      toast.error("An error occurred during sign in.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailAuth = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        name: formData.name,
        isSignUp: isSignUp.toString(),
        isSetPassword: isSetPassword.toString(),
        signUpRole: isSignUp && isReferrerSignUp ? "referrer" : "user",
        callbackUrl,
        redirect: false,
      });

      if (result?.error) {
        toast.error(result.error);
      } else if (result?.ok) {
        toast.success(
          isSignUp
            ? isReferrerSignUp
              ? "Account created. It will go live after admin approval."
              : "Account created successfully!"
            : isSetPassword
              ? "Password set successfully!"
              : "Signed in successfully!",
        );
        router.push(callbackUrl);
      }
    } catch (error) {
      toast.error("An error occurred during authentication.");
    } finally {
      setIsLoading(false);
    }
  };

  const title = isSignUp
    ? "Create your account"
    : isSetPassword
      ? "Set your password"
      : "Welcome back";
  const description = isSignUp
    ? isReferrerSignUp
      ? "Create your referral account. An administrator will approve it before it goes live."
      : "Create an account to keep your project information in one place."
    : isSetPassword
      ? "Enter your account email and choose a secure password."
      : "Sign in to your Better Homes account.";

  return (
    <main className="min-h-screen bg-white font-[Satoshi] text-slate-950">
      <div className="grid min-h-screen lg:grid-cols-[minmax(520px,0.92fr)_minmax(480px,1.08fr)]">
        <section className="relative flex min-h-screen flex-col px-6 py-6 sm:px-10 lg:px-14 xl:px-20">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="group flex items-center gap-3 text-slate-950 hover:text-slate-950"
              aria-label="Better Homes home"
            >
              <span className="flex h-9 w-9 items-center justify-center border border-slate-300 font-serif text-sm tracking-tight transition-colors group-hover:border-slate-500">
                BH
              </span>
              <span className="text-[12px] font-semibold uppercase tracking-[0.2em]">
                Better Homes
              </span>
            </Link>
            <div className="hidden items-center gap-2 text-[11px] text-slate-500 sm:flex">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              Secure account access
            </div>
          </div>

          <div className="mx-auto flex w-full max-w-[430px] flex-1 flex-col justify-center py-12 lg:py-16">
            <div className="mb-9">
              <h1 className="text-[34px] font-semibold leading-tight tracking-[-0.035em] text-slate-950 sm:text-[40px]">
                {title}
              </h1>
              <p className="mt-3 max-w-sm text-[15px] leading-6 text-slate-500">
                {description}
              </p>
            </div>

            {isReferrerSignUp && (
              <div className="mb-6 border-l-2 border-emerald-500 bg-emerald-50 px-4 py-3 text-[13px] leading-5 text-emerald-900">
                You’ll receive a personal dashboard, referrals list, and unique
                share link after approval.
              </div>
            )}

            {!isReferrerSignUp && (
              <>
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                  className="flex h-11 w-full items-center justify-center gap-3 rounded-md border border-slate-300 bg-white px-4 text-[13px] font-medium text-slate-800 transition hover:border-slate-400 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <GoogleIcon />
                  Continue with Google
                </button>

                <div className="my-7 flex items-center gap-4">
                  <div className="h-px flex-1 bg-slate-200" />
                  <span className="text-[11px] text-slate-400">
                    or use your email
                  </span>
                  <div className="h-px flex-1 bg-slate-200" />
                </div>
              </>
            )}

            <form className="space-y-5" onSubmit={handleEmailAuth}>
              {isSignUp && (
                <label className="block">
                  <span className="mb-2 block text-[12px] font-medium text-slate-700">
                    Full name
                  </span>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Your full name"
                    className="h-11 w-full rounded-md border border-slate-300 bg-white px-3.5 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  />
                </label>
              )}

              <label className="block">
                <span className="mb-2 block text-[12px] font-medium text-slate-700">
                  Email address
                </span>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="name@example.com"
                  className="h-11 w-full rounded-md border border-slate-300 bg-white px-3.5 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </label>

              <label className="block">
                <span className="mb-2 flex items-center justify-between text-[12px] font-medium text-slate-700">
                  Password
                  {!isSignUp && !isSetPassword && (
                    <button
                      type="button"
                      onClick={() => setMode("password")}
                      className="font-medium text-blue-700 hover:text-blue-800"
                    >
                      Set or reset password
                    </button>
                  )}
                </span>
                <span className="relative block">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete={
                      isSignUp || isSetPassword
                        ? "new-password"
                        : "current-password"
                    }
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder={
                      isSetPassword
                        ? "Choose a secure password"
                        : "Enter your password"
                    }
                    className="h-11 w-full rounded-md border border-slate-300 bg-white px-3.5 pr-11 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((visible) => !visible)}
                    className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-slate-400 hover:text-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </span>
              </label>

              <button
                type="submit"
                disabled={isLoading}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-md bg-blue-600 px-4 text-[13px] font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                {isSignUp
                  ? "Create account"
                  : isSetPassword
                    ? "Set password"
                    : "Sign in"}
              </button>
            </form>

            <p className="mt-7 text-center text-[13px] text-slate-500">
              {isSignUp ? "Already have an account?" : "Don’t have an account?"}{" "}
              <button
                type="button"
                onClick={() => setMode(isSignUp ? "signin" : "signup")}
                className="font-semibold text-blue-700 hover:text-blue-800"
              >
                {isSignUp ? "Sign in" : "Create account"}
              </button>
              {isSetPassword && (
                <>
                  {" · "}
                  <button
                    type="button"
                    onClick={() => setMode("signin")}
                    className="font-semibold text-blue-700 hover:text-blue-800"
                  >
                    Return to sign in
                  </button>
                </>
              )}
            </p>
          </div>

          <Link
            href="/"
            className="inline-flex w-fit items-center gap-2 text-[12px] font-medium text-slate-500 transition hover:text-slate-950"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Better Homes
          </Link>
        </section>

        <aside className="relative hidden overflow-hidden bg-slate-900 lg:block">
          <Image
            src="/assets/img/index-hero.webp"
            alt="A completed Better Homes interior"
            fill
            priority
            sizes="(min-width: 1024px) 52vw, 0vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-transparent to-slate-950/10" />
          <div className="absolute inset-x-0 bottom-0 p-10 text-white xl:p-14">
            <div className="max-w-md border-l border-white/60 pl-5">
              <p className="text-lg font-medium leading-7 tracking-[-0.01em]">
                Your project details, documents, decisions and support—all in
                one secure place.
              </p>
              <p className="mt-3 text-[12px] text-white/70">
                Better Homes client portal
              </p>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}

function SignInLoading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-white">
      <Loader2
        className="h-6 w-6 animate-spin text-blue-600"
        aria-label="Loading sign in"
      />
    </main>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<SignInLoading />}>
      <SignInForm />
    </Suspense>
  );
}
