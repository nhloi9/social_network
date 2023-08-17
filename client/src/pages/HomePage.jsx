import React from 'react'
import {} from 'react-router-dom'
import Status from '../components/home/Status.jsx'
import Posts from '../components/home/Posts.jsx'
import Suggest from '../components/home/Suggest.jsx'

const HomePage = () => {
  return (
    <div className='w-full max-w-[1000px] mx-auto 800px:flex'>
      <div className='w-full px-5 800px:w-[65%] '>
        <Status />
        <Posts />
      </div>
      <div className='w-full 800px:w-[35%]'>
        <Suggest />
      </div>
    </div>
  )
}

export default HomePage
