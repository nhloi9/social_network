import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import UserCard from '../UserCard'
import { getDataApi } from '../../utils/fetchData'
import FollowBtn from '../FollowBtn'
import { TfiReload } from 'react-icons/tfi'
import Lottie from 'react-lottie'

import * as animationData from '../../animation/animation_ll70lfkr.json'

const Suggest = () => {
  const { user } = useSelector(state => state.auth)
  const [suggestUser, setSuggestUser] = useState(null)
  const [loading, setLoading] = useState(false)

  const getSuggestUser = async () => {
    try {
      setLoading(true)
      const { data } = await getDataApi(`/user/suggest/list`)
      setSuggestUser(data.suggestUser)
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }

  useEffect(() => {
    getSuggestUser()
  }, [])
  return (
    <div className='w-full p-4'>
      {/* <Link to={`/profile/${user._id}`} className='flex gap-2 cursor-pointer'>
        <Avatar url={user.avatar} size={'big-avatar'} />
        <div className='flex flex-col justify-center gap-2  '>
          <h1 className='text-blue-700 font-[500] leading-3 hover:underline'>
            {user.username}
          </h1>
          <h1 className='text-blue-500 leading-3 hover:underline'>
            {user.fullname}
          </h1>
        </div>
      </Link> */}
      <UserCard user={user} />
      <div className='flex justify-between items-center'>
        <h1 className=' my-3 text-[20px] font-[700] text-red-600'>
          Suggest for you
        </h1>
        {!loading && (
          <TfiReload
            size={30}
            color='blue'
            className='!font-[600] mr-2 cursor-pointer '
            onClick={getSuggestUser}
          />
        )}
      </div>
      {loading ? (
        <Lottie width={50} height={50} options={{ animationData }}></Lottie>
      ) : (
        suggestUser &&
        suggestUser.map(item => (
          <UserCard user={item}>
            <FollowBtn person={item} />
          </UserCard>
        ))
      )}
    </div>
  )
}

export default Suggest
