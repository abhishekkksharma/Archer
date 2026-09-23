import AboutMain from '@/components/About/AboutMain'
import Navbar from '@/components/Header/Navbar'
import React from 'react'

function page() {
  return (
    <div>
        <Navbar theme="light"/>
        <AboutMain/>
    </div>
  )
}

export default page