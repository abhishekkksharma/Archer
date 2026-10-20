import Navbar from '@/components/Header/Navbar'
import React from 'react'
import Document from '@/components/Docs/Document'

function page() {
  return (
    <div className='min-h-screen flex justify-center items-center'>
      <Navbar theme='light' />
      <Document />
      {/* <p>Work in progress</p> */}
    </div>
  )
}

export default page