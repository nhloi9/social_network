import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { getPost } from '../redux/actions/postAction'
import PostCard from '../components/post_card/PostCard'

const DetailPostPage = () => {
  const dispatch = useDispatch()
  const { id } = useParams()
  const [postData, setPostData] = useState(null)

  const { detailPost } = useSelector(state => state)

  useEffect(() => {
    dispatch(getPost({ id }))
  }, [dispatch, id])
  useEffect(() => {
    setPostData(detailPost.find(item => item._id === id))
  }, [setPostData, detailPost, id])
  return (
    <div className='w-full 1000px:w-[80%] mx-auto max-w-[1000px]'>
      {postData && <PostCard post={postData} />}
    </div>
  )
}

export default DetailPostPage
