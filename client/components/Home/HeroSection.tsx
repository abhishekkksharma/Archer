"use client";

import React, { useState, useEffect } from "react";
import backgroundImage from "@/assets/ProfileIcons/Midnight Teal to Mint Glow.png";

function HeroSection() {
  const tags = ["Real", "Better", "Bolder", "Structured", "Scalable"];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % tags.length);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <section
      style={{
        backgroundImage: `
    linear-gradient(
      to bottom,
      transparent 50%,
      rgba(250, 250, 250, 0.3) 70%,
      rgba(250, 250, 250, 0.9) 95%,
      rgb(255, 255, 255) 100%
    ),
    url('${backgroundImage.src}')
  `,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
      className="flex w-full min-h-screen px-6 pb-20 md:px-12 lg:px-20"
    // bg-[#080d12] bg-[radial-gradient(ellipse_70%_55%_at_50%_100%,rgba(225,244,238,0.95)_0%,rgba(142,205,170,0.7)_25%,rgba(41,174,174,0.45)_48%,transparent_75%),radial-gradient(ellipse_90%_65%_at_55%_80%,rgba(27,178,183,0.8)_0%,rgba(16,108,125,0.55)_40%,transparent_75%),linear-gradient(to_bottom,#000000_0%,#0b1720_25%,#103b46_48%,#1a777d_72%,#9bc8af_100%)]
    >
      <style>{`
        @keyframes slideUpFade {
          0% {
            opacity: 0;
            transform: translateY(100%);
          }
          12% {
            opacity: 1;
            transform: translateY(0);
          }
          88% {
            opacity: 1;
            transform: translateY(0);
          }
          100% {
            opacity: 0;
            transform: translateY(-100%);
          }
        }
        .animate-slide-up-fade {
          display: inline-block;
          animation: slideUpFade 2.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
      <div className="grid w-full grid-cols-1 items-center gap-12 md:grid-cols-2 md:gap-16 lg:gap-24">
        {/* Left */}
        <div >
          <h1 className="font-sans text-5xl font-semibold tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl">
            Turn Your Ideas
            <br className="hidden md:inline" />{" "}
            <span className="relative inline-flex overflow-hidden h-[1.2em] translate-y-[0.18em] align-bottom">
              <span
                key={index}
                className="animate-slide-up-fade font-thin italic text-slate-100"
              >
                {tags[index]}
              </span>
            </span>
          </h1>
        </div>

        {/* Right */}
        <div className="max-w-xl text-zinc-200">
          <p className="text-base font-light leading-relaxed sm:text-lg md:text-xl">
            Transform your ideas into clear, actionable projects. From product
            roadmaps and system architecture to design strategies and
            development plans, Shape helps you turn a vision into a structured
            path forward.
          </p>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
