import Navbar from '@/components/Header/Navbar'
import React from 'react'
import Document from '@/components/Docs/Document'

function page() {
  return (
    <div className='min-h-screen w-full bg-white dark:bg-black'>
      <Navbar theme='light' />
      <Document />
    </div>
  )
}

export default page