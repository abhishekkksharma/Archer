"use client";

import Navbar from "@/components/Header/Navbar";
import WelcomeContainer from "@/components/Dashboard/WelcomeContainer";
import Projects from "@/components/Dashboard/Projects";

function page() {
  return (
    <>
      <div className="bg-zinc-50 dark:bg-black min-h-screen pb-12">
        <Navbar theme="light" />
        <WelcomeContainer/>
        <Projects/>
      </div>
    </>
  );
}

export default page;
