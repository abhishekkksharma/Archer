import React from 'react'
import ProjectPreview from './ProjectPreview';
interface IPublishedProject{
    id:string
}

function PublishedProject({id}:IPublishedProject) {
    const projectId=id;

  return (
    <section className='px-6 lg:px-[20%] pt-18'>
        <ProjectPreview id={id}/>
    </section>
  )
}

export default PublishedProject