import React from 'react'

function Loader() {
  return (
    <div className='flex justify-center items-center gap-2 flex-col min-h-screen'>
        <div className="loader h-40 w-40"></div>
        <p className='text-zinc-400 dark:text-zinc-300 animate-pulse'>Loading...</p>
    </div>
  )
}

export default Loader