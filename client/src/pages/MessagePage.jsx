import React from 'react'
import LeftSide from '../components/message/LeftSide'
import RightSide from '../components/message/RightSide'

const MessagePage = () => {
  return (
    <div className='w-full 1100px:w-[80%] mx-auto flex my-5 border h-[calc(100vh-120px)] 800px:h-[calc(100vh-100px)] '>
      <div className='w-full flex-[1] border-r'>
        <LeftSide />
      </div>
      <div className='flex-[2]'>
        <RightSide />
      </div>
    </div>
  )
}

export default MessagePage
