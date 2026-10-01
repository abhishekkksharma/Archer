import Navbar from '@/components/Header/Navbar'
import ProfileMain from '@/components/Profile/ProfileMain'
import React from 'react'

function page() {
  return (
    <div className='pt-16'>
        <Navbar theme='light'/>
        <ProfileMain/>
    </div>
  )
}

export default page