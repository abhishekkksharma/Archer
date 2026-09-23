"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ArrowUpRight, Mail } from "lucide-react";
import MailImg from "@/assets/Footer/mail.png";
import backgroundImage from "@/assets/ProfileIcons/Midnight Teal to Mint Glow.png";

function Footer() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !email.includes("@")) return;

    setSubmitted(true);
    setEmail("");
  };

  return (
    <footer className="w-full py-10 sm:py-12">
      {/* Contact Card */}
      <div
        // style={{
        //   backgroundImage: `
        //   url('${backgroundImage.src}')
        // `,
        //   backgroundSize: "cover",
        //   backgroundPosition: "center",
        //   backgroundRepeat: "no-repeat",
        // }}
        id="contact"
        className="
          relative
          mx-auto
          w-[92%]
          max-w-5xl
          overflow-visible
          rounded-3xl
          bg-zinc-950
          dark:bg-zinc-900
          px-6
          sm:px-10
          lg:px-14
          py-6
          shadow-lg
          shadow-zinc-600/20
        "
      >
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          {/* Image */}
          <div className="relative flex w-full lg:w-[38%] justify-center lg:justify-start">
            <Image
              src={MailImg}
              alt="Contact us"
              className="
                w-44
                lg:-mt-38
                -mt-25
                sm:w-52
                lg:w-80
                object-contain
                transition-transform
                duration-500
                hover:-translate-y-2
              "
            />
          </div>

          {/* Content */}
          <div className="w-full lg:w-[58%] text-white">
            <p className="mb-2 text-xs sm:text-sm font-medium text-blue-200">
              Get in touch
            </p>

            <h2
              className="
                max-w-xl
                text-2xl
                sm:text-3xl
                lg:text-[32px]
                font-semibold
                leading-tight
              "
            >
              Have something to share?
              <br />
              We'd love to hear from you.
            </h2>

            <p className="mt-3 max-w-lg text-sm leading-6 text-zinc-100">
              Share your email with us and we'll try to connect you soon.
            </p>

            {/* Email Form */}
            <form
              onSubmit={handleSubmit}
              className="
                group
                mt-5
                flex
                w-full
                max-w-md
                items-center
                gap-1
                rounded-full
                border
                border-white/20
                bg-white/10
                p-1
                backdrop-blur-xl
                transition-all
                duration-300
                focus-within:border-white/40
                focus-within:bg-white/15
                focus-within:shadow-lg
                focus-within:shadow-black/10
              "
            >
              <div className="flex min-w-0 flex-1 items-center gap-2 px-3">
                <Mail size={16} className="shrink-0 text-zinc-200" />

                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setSubmitted(false);
                  }}
                  placeholder="Enter your email"
                  required
                  className="
                    min-w-0
                    flex-1
                    bg-transparent
                    py-2
                    text-sm
                    text-white
                    outline-none
                    placeholder:text-zinc-100/80
                  "
                />
              </div>

              <button
                type="submit"
                className="
                  group/button
                  flex
                  shrink-0
                  items-center
                  gap-2
                  rounded-full
                  bg-white
                  px-4
                  py-2
                  text-sm
                  font-medium
                  text-zinc-900
                  transition-all
                  duration-300
                  hover:bg-blue-50
                  active:scale-95
                "
              >
                <span>Submit</span>

                <ArrowUpRight
                  size={15}
                  className="
                    transition-transform
                    duration-300
                    group-hover/button:-translate-y-0.5
                    group-hover/button:translate-x-0.5
                  "
                />
              </button>
            </form>

            {submitted && (
              <p className="mt-2 text-xs text-green-300">
                Thanks! We'll be in touch soon.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Footer Content */}
      <div className="mt-10 w-full px-6 sm:px-10 lg:px-16 ">
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
          {/* <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
            © {new Date().getFullYear()} Archer. All rights reserved.
          </p> */}

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
