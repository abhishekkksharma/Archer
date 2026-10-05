"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ArrowUpRight, Mail, Phone } from "lucide-react";
import MailImg from "@/assets/Footer/mail.png";
import { usePopup } from "../Popup/PopupContext";

function Footer() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { showPopup } = usePopup();

 const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  if (!email || !email.includes("@")) return;

  setLoading(true);
  setSubmitted(false);
  setError("");

  try {
    const formData = new FormData();

    formData.append(
      "access_key",
      process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY || ""
    );

    formData.append("email", email);
    formData.append("subject", "New Contact Submission - Archer");
    formData.append("from_name", "Archer Website");
    formData.append("message", `New user submitted their email: ${email}`);

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (data.success) {
      setEmail("");

      showPopup("Thanks! We'll be in touch soon.","success");
    } else {
      showPopup(data.message || "Something went wrong.","error");
    }
  } catch (err) {
    showPopup("Unable to submit your email. Please try again.","error");
  } finally {
    setLoading(false);
  }
};

  return (
    <footer className="w-full py-10 sm:py-12">
      {/* Contact Card */}
      <div
  id="contact"
  className="
    relative
    mx-auto
    w-[92%]
    max-w-3xl
    overflow-visible
    rounded-2xl
    border
    border-blue-100
    bg-white
    px-5
    py-5
    shadow-sm
    shadow-zinc-200/60
    dark:border-zinc-800
    dark:bg-zinc-950
    dark:shadow-none
    sm:px-7
    lg:px-6
  "
>
  <div className="flex flex-col items-center justify-between gap-4 lg:flex-row">

    {/* Image */}
    <div className="relative flex w-full justify-center lg:w-[35%] lg:justify-start">
      <Image
        src={MailImg}
        alt="Contact us"
        className="
          -mt-22
          w-50
          object-contain
          transition-transform
          duration-500
          hover:-translate-y-1
          sm:w-36
          lg:-mt-28
          lg:w-fit
        "
      />
    </div>

    {/* Content */}
    <div className="w-full lg:w-[60%]">
      <p
        className="
          mb-1
          text-xs
          font-medium
          text-blue-600
          dark:text-blue-400
        "
      >
        Get in touch
      </p>

      <h2
        className="
          max-w-lg
          text-xl
          font-semibold
          leading-tight
          text-zinc-900
          sm:text-2xl
          dark:text-white
        "
      >
        Have something to share?
        <br />
        We'd love to hear from you.
      </h2>

      <p
        className="
          mt-2
          max-w-md
          text-xs
          leading-5
          text-zinc-600
          sm:text-sm
          dark:text-zinc-400
        "
      >
        Share your email with us and we'll try to connect you soon.
      </p>

      {/* Email Form */}
      <form
        onSubmit={handleSubmit}
        className="
          group
          mt-4
          flex
          w-full
          max-w-sm
          items-center
          gap-1
          rounded-full
          border
          border-zinc-200
          bg-zinc-50
          p-1
          transition-all
          duration-300
          focus-within:border-blue-300
          focus-within:bg-white
          dark:border-zinc-800
          dark:bg-zinc-900
          dark:focus-within:border-zinc-700
          dark:focus-within:bg-zinc-900
        "
      >
        <div className="flex min-w-0 flex-1 items-center gap-2 px-2.5">
          <Mail
            size={15}
            className="shrink-0 text-zinc-500 dark:text-zinc-400"
          />

          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setSubmitted(false);
              setError("");
            }}
            placeholder="Enter your email"
            required
            className="
              min-w-0
              flex-1
              bg-transparent
              py-1.5
              text-xs
              text-zinc-900
              outline-none
              placeholder:text-zinc-400
              dark:text-white
              dark:placeholder:text-zinc-500
            "
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="
            group/button
            flex
            shrink-0
            items-center
            gap-1.5
            rounded-full
            bg-zinc-900
            px-3.5
            py-1.5
            text-xs
            font-medium
            text-white
            transition-all
            duration-300
            hover:bg-blue-600
            active:scale-95
            disabled:cursor-not-allowed
            disabled:opacity-60
            dark:bg-white
            dark:text-zinc-900
            dark:hover:bg-blue-50
          "
        >
          <span>{loading ? "Sending..." : "Submit"}</span>

          {!loading && (
            <ArrowUpRight
              size={14}
              className="
                transition-transform
                duration-300
                group-hover/button:-translate-y-0.5
                group-hover/button:translate-x-0.5
              "
            />
          )}
        </button>
      </form>
    </div>
  </div>
</div>

      {/* Footer Content */}
      <div className="mt-10 w-full px-6 sm:px-10 lg:px-16">
        <div
          className="
            grid
            grid-cols-1
            gap-8
            sm:grid-cols-2
            lg:grid-cols-[2fr_1fr_1fr]
          "
        >
          {/* Brand */}
          <div>
            <h3 className="text-xl font-semibold text-zinc-900 dark:text-white">
              Archer
            </h3>

            <p className="mt-3 max-w-sm text-sm leading-6 text-zinc-500 dark:text-zinc-400">
              Build, plan and bring your ideas to life with a simpler and
              smarter workflow.
            </p>

            <a
              href="mailto:abhisheksharma7340733@gmail.com"
              className="
                mt-4
                inline-flex
                items-center
                gap-2
                text-sm
                font-medium
                text-blue-700
                dark:text-blue-400
                transition-colors
                hover:text-blue-500
              "
            >
              abhisheksharma7340733@gmail.com
            </a>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-zinc-900 dark:text-white">
              Quick Links
            </h4>

            <div className="mt-4 flex flex-col gap-3">
              <a
                href="/"
                className="text-sm text-zinc-500 dark:text-zinc-400 transition-colors hover:text-blue-600 dark:hover:text-blue-400"
              >
                Home
              </a>

              <a
                href="/about"
                className="text-sm text-zinc-500 dark:text-zinc-400 transition-colors hover:text-blue-600 dark:hover:text-blue-400"
              >
                About
              </a>

              <a
                href="/dashboard"
                className="text-sm text-zinc-500 dark:text-zinc-400 transition-colors hover:text-blue-600 dark:hover:text-blue-400"
              >
                Dashboard
              </a>

              <a
                href="#contact"
                className="text-sm text-zinc-500 dark:text-zinc-400 transition-colors hover:text-blue-600 dark:hover:text-blue-400"
              >
                Contact
              </a>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-zinc-900 dark:text-white">
              Contact
            </h4>

            <a
              href="mailto:abhisheksharma7340733@gmail.com"
              className="
                mt-4
                flex
                items-center
                gap-2
                text-sm
                text-zinc-500
                dark:text-zinc-400
                transition-colors
                hover:text-blue-600
                dark:hover:text-blue-400
              "
            >
              <Mail size={16} />
              abhisheksharma7340733@gmail.com
            </a>
            <p
              className="
                mt-4
                flex
                items-center
                gap-2
                text-sm
                text-zinc-500
                dark:text-zinc-400
                transition-colors
                hover:text-blue-600
                dark:hover:text-blue-400
              "
            >
              <Phone size={16} />
              +91 7340733286
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          className="
            mt-8
            flex
            flex-col
            sm:flex-row
            items-center
            justify-between
            gap-4
            border-t
            border-zinc-200
            dark:border-zinc-800
            pt-5
          "
        >
          <div className="flex items-center gap-5">
            <a
              href="#privacy"
              className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
            >
              Privacy
            </a>

            <a
              href="#terms"
              className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
            >
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;