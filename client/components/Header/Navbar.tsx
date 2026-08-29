"use client";

import React, { useEffect, useState } from "react";
import Logo from "../../public/logoSVG.png";
import Image from "next/image";
import Link from "next/link";
import ThemeToggle from "../ThemeToggle";
import ProfileButton from "./ProfileButton";

interface NavbarProps {
  theme?: "light" | "dark";
}

function Navbar({ theme }: NavbarProps = {}) {
  const [scrolled, setScrolled] = useState(() => {
    if (theme === "light") return true;
    if (theme === "dark") return false;
    return false;
  });

  const links = [
    {
      name: "About",
      link: "/about",
    },
    {
      name: "Dashboard",
      link: "/dashboard",
    },
    {
      name: "Help",
      link: "#",
    },
  ];

  useEffect(() => {
    if (theme === "light") {
      setScrolled(true);
      return;
    }
    if (theme === "dark") {
      setScrolled(false);
      return;
    }

    const handleScroll = () => {
      const halfScreen = window.innerHeight / 2;
      setScrolled(window.scrollY > halfScreen);
    };

    window.addEventListener("scroll", handleScroll);

    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [theme]);

  return (
    <nav className="fixed top-0 left-0 z-50 flex w-full items-center justify-between px-6 py-4 md:px-12 lg:px-20">
      
      {/* Logo */}
      <Link href="/" className="flex items-center gap-3">
        <Image
          className={`h-10 w-10 transition-all duration-500 ${
            scrolled ? "dark:invert" : "invert"
          }`}
          src={Logo}
          alt="Archer logo"
        />

        <span
          className={`text-xl font-medium tracking-wide hidden lg:flex transition-colors duration-500 ${
            scrolled ? "text-black dark:text-white" : "text-white"
          }`}
        >
          Archer
        </span>
      </Link>

      {/* Navigation Links */}
      <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 md:flex">
        {links.map((item) => (
          <Link
            key={item.name}
            href={item.link}
            className={`text-sm transition-colors duration-500 hover:font-semibold ${
              scrolled
                ? "text-zinc-800 hover:text-black dark:text-white dark:hover:text-white"
                : "text-zinc-200 hover:text-white"
            }`}
          >
            {item.name}
          </Link>
        ))}
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-4">
        <ThemeToggle scrolled={scrolled} />
        <ProfileButton scrolled={scrolled} />
      </div>
    </nav>
  );
}

export default Navbar;