import React, { useState } from 'react'
import Avatar from '../Avatar'
import { useSelector } from 'react-redux'
import CreatePost from './CreatePost'
// import { GLOBALTYPES } from '../../redux/actions/globalTypes'

const Status = () => {
  const [onCreatePost, setOnCreatePost] = useState(false)
  const { user } = useSelector(state => state.auth)
  // const dispatch = useDispatch()
  // useEffect(() => {
  //   if (onCreatePost) {
  //     dispatch({
  //       type: GLOBALTYPES.MODAL,
  //       payload: true
  //     })
  //   } else {
  //     dispatch({
  //       type: GLOBALTYPES.MODAL,
  //       payload: false
  //     })
  //   }
  // }, [onCreatePost, dispatch])
  return (
    <div className='w-full mt-4 '>
      <div className='shadow-[0_0_1px] hover:shadow-[0_0_5px_gray]  h-[80px] p-4 rounded-md flex items-center  justify-between gap-2 '>
        <Avatar url={user?.avatar} size={'big-avatar'} />
        <input
          type='text'
          className='block w-full h-[50px] outline-none bg-gray-100 rounded-[20px] pl-3 cursor-pointer hover:bg-gray-200'
          placeholder={`${user?.fullname} ơi, bạn đang nghĩ gì thế ?`}
          // disabled
          onClick={() => {
            setOnCreatePost(true)
            // console.log(object);
          }}
        />
        {onCreatePost && (
          <CreatePost setOnCreatePost={setOnCreatePost} user={user} />
        )}
      </div>
    </div>
  )
}

export default Status
