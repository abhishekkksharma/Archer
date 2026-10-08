import React from 'react'
import Navbar from '../Header/Navbar'
import MappedProjects from './MappedProjects'


function PublishMain() {
  return (
    <div className='px-[20%] pt-26'>
        <Navbar theme='light'/>
        <MappedProjects/>
    </div>
  )
}

export default PublishMain