import React from 'react'
import { Link } from 'react-router-dom'
import Avatar from './Avatar'

const UserCard = ({ user, children, setTerm, msg }) => {
  return (
    <div className='w-full flex justify-between items-center '>
      <Link
        className='w-full h-[40px] my-3 p-1 flex items-center cursor-pointer hover:bg-gray-300 rounded-md mr-1'
        to={!msg && `/profile/${user._id}`}
        onClick={() => setTerm && setTerm('')}
      >
        <Avatar url={user.avatar} size='medium-avatar' />
        <div className='flex flex-col justify-center pl-2'>
          <h1 className='leading-4 text-blue-800'>{user.username}</h1>
          <h1 className='leading-3 text-[12px] text-blue-400'>
            {user.fullname}
          </h1>
        </div>
      </Link>
      {children}
    </div>
  )
}

export default UserCard
