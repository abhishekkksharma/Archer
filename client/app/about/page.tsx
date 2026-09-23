import AboutMain from '@/components/About/AboutMain'
import Footer from '@/components/Footer/Footer'
import Navbar from '@/components/Header/Navbar'
import React from 'react'

function page() {
  return (
    <div>
        <Navbar theme="light"/>
        <AboutMain/>
        <Footer/>
    </div>
  )
}

export default page