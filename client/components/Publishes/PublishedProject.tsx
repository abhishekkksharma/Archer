import React from 'react'
import ProjectPreview from './ProjectPreview';
import CanvasReadOnly from './CanvasReadOnly';
interface IPublishedProject {
  id: string
}

function PublishedProject({ id }: IPublishedProject) {
  const projectId = id;

  return (
    <section className='px-6 lg:px-[20%] pt-18'>
      <ProjectPreview id={id} />
      <div className="py-18 flex flex-col gap-4">
        <div className="flex flex-col lg:px-6 gap-2">
          <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
            System Architecture
          </h2>
          <p className='text-sm text-zinc-700 dark:text-zinc-100'>Understand the project better with it's Architecture</p>
        </div>

        <div className=" lg:p-2 w-full">
          <CanvasReadOnly
            projectId={id}
            className="relative w-full h-120 rounded-xl border border-zinc-200 shadow-sm dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50"
          />
        </div>
      </div>
    </section>
  )
}

export default PublishedProject