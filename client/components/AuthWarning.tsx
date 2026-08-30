import Link from "next/link";
import React from "react";

function AuthWarning() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl bg-transparent  p-8 text-center">
        {/* Icon */}
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 dark:bg-zinc-900">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.7}
            stroke="currentColor"
            className="h-7 w-7 text-slate-700 dark:text-zinc-300"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25V9m-3 0h10.5A2.25 2.25 0 0118 11.25v7.5A2.25 2.25 0 0115.75 21h-7.5A2.25 2.25 0 016 18.75v-7.5A2.25 2.25 0 018.25 9z"
            />
          </svg>
        </div>

        {/* Heading */}
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          Authentication Required
        </h2>

        {/* Description */}
        <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          Please log in or create an account to access this page and continue.
        </p>

        {/* Actions */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
          >
            Login
          </Link>

          <Link
            href="/signup"
            className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-900 transition hover:bg-slate-50 dark:border-zinc-700 dark:bg-black dark:text-white dark:hover:bg-zinc-900"
          >
            Sign Up
          </Link>
        </div>

        {/* Back */}
        <Link
          href="/"
          className="mt-5 inline-block text-xs text-zinc-500 transition hover:text-zinc-900 dark:hover:text-zinc-200"
        >
          ← Back to home
        </Link>
      </div>
    </div>
  );
}

export default AuthWarning;