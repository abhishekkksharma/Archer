"use client"

import React from 'react'
import { useParams } from 'next/navigation'
import PublishedProject from '@/components/Publishes/PublishedProject';
import Navbar from '@/components/Header/Navbar';

function page() {
    const {id} =useParams();
    
  return (
    <div>
        <Navbar theme='light'/>
        <PublishedProject id={id as string}/>
    </div>
  )
}

export default page