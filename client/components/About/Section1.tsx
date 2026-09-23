import React from 'react'
import FolderFloat from './FloatFolder'

function Section1() {
    return (
        <section className="w-full min-h-[50vh]  flex items-center px-6 sm:px-10 lg:px-20 py-12 lg:py-16  mt-10 lg:mt-18">
            <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">

                <div>
                    <p className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl dark:text-white font-semibold tracking-tight">
                        About Us.
                    </p>
                </div>

                <div className="flex flex-col gap-5 max-w-2xl font-thin text-base sm:text-base lg:text-lg text-justify text-gray-600 dark:text-white">
                    <p className="leading-relaxed ">
                        <span className=" font-semibold text-2xl">"</span>
                        Archer is a tool designed to help you turn your ideas into reality.
                        You may have an exciting idea in your mind, but figuring out where to
                        start and how to execute it can often feel overwhelming.
                    </p>

                    <p className="leading-relaxed">
                        <span className="bg-blue-200 px-1 mr-1 dark:text-black ">We help you transform your imagination into a clear, actionable plan.</span>
                        From creating roadmaps and defining architecture to planning your
                        development journey and tracking progress, Archer gives you the
                        structure and guidance you need to build with confidence.
                        <span className=" font-semibold text-2xl">"</span>
                    </p>
                </div>

            </div>
        </section>
    )
}

export default Section1