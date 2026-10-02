
import React from 'react'
import UserInfo from './UserInfo'
import ProfileSidebar from './ProfileSidebar'

function ProfileMain() {
  return (
    <div className='px-6 lg:px-[25%] flex gap-15 flex-row'>
        {/* <div className='w-50 py-15'>
            <ProfileSidebar/>
        </div> */}
        <div className='w-full'>
        <UserInfo/>
            {/* <hr className="border border-zinc-400/40" /> */}
        </div>
    </div>
  )
}

export default ProfileMain