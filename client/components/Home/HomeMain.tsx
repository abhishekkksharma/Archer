import React from 'react'
import HeroSection from './HeroSection'
import HowWeWork from './HowWeWork'
import FaqSection from '../FaqSection'
import StartBuilding from '../About/StartBuilding'

function HomeMain() {
    return (
        <div>
            <HeroSection />
            <div className='pt-20'>
                <StartBuilding/>
            </div>
            <HowWeWork/>
            <FaqSection/>
        </div>
    )
}

export default HomeMain