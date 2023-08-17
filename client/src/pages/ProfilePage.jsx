import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Info from '../components/profile/Info.jsx'
import ProfilePosts from '../components/profile/ProfilePosts.jsx'
import { useDispatch, useSelector } from 'react-redux'
import { getProfileUsers } from '../redux/actions/profileAction.js'
import PostsThumbnail from '../components/PostsThumbnail.jsx'

const ProfilePage = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const { ids } = useSelector(state => state.profile)
  const { user } = useSelector(state => state.auth)
  const [active, setActive] = useState(1)
  const { save } = useSelector(state => state)
  useEffect(() => {
    if (!ids.includes(id)) {
      dispatch(getProfileUsers({ id }))
    }
  }, [dispatch, ids, id])

  return (
    <div>
      <Info id={id} />
      {user._id === id && (
        <div className='flex justify-center gap-3 w-full border-y border-y-gray mb-2 '>
          <h1
            className={`text-[18px] font-[500] p-1 ${
              active === 1
                ? 'text-blue-600 border-y-2 border-y-blue-500'
                : 'opacity-30'
            } cursor-pointer`}
            onClick={() => setActive(1)}
          >
            Posts
          </h1>
          <h1
            className={` p-1 text-[18px] font-[500] ${
              active === 2
                ? 'text-blue-600 border-y-2  border-y-blue-500'
                : 'opacity-30'
            } cursor-pointer`}
            onClick={() => setActive(2)}
          >
            Save
          </h1>
        </div>
      )}
      <br />
      {active === 1 ? (
        <ProfilePosts id={id} />
      ) : (
        <PostsThumbnail posts={save.posts} />
      )}
    </div>
  )
}

export default ProfilePage
