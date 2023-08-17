import React, { useEffect, useRef, useState } from 'react'
import {
  BsSend,
  BsHeartFill,
  BsChat,
  BsHeart,
  BsBookmark,
  BsBookmarkFill
} from 'react-icons/bs'
import { useDispatch, useSelector } from 'react-redux'
import { likePost, unlikePost } from '../../redux/actions/postAction'
import Followers from '../profile/Followers'
import Share from '../Share.jsx'
import { useNavigate } from 'react-router-dom'
import { savePost, unsavePost } from '../../redux/actions/saveAction'

const CardFooter = ({ post }) => {
  const navigate = useNavigate()
  const theme = useSelector(state => state.theme)
  const dispatch = useDispatch()
  const { user } = useSelector(state => state.auth)
  const { posts } = useSelector(state => state.save)

  const [islike, setIslike] = useState(false)
  const [isSave, setIsSave] = useState(false)
  const likeRef = useRef(null)
  const saveRef = useRef(null)
  const [openLikes, setOpenLikes] = useState(false)
  const [isOpenShare, setIsOpenShare] = useState(false)

  useEffect(() => {
    // console.log('likes')
    if (post?.likes?.find(like => like.user._id === user?._id)) {
      setIslike(true)
    } else setIslike(false)
  }, [post.likes, setIslike, user?._id])

  useEffect(() => {
    if (posts.find(item => item._id === post._id)) {
      setIsSave(true)
    } else setIsSave(false)
  }, [posts, post._id])

  const like = () => {
    likeRef.current.classList.add('pointer-events-none')
    setTimeout(() => {
      likeRef.current.classList.remove('pointer-events-none')
    }, 1000)
    setIslike(true)
    dispatch(likePost(post))
  }
  const unlike = () => {
    likeRef.current.classList.add('pointer-events-none')
    setTimeout(() => {
      likeRef.current.classList.remove('pointer-events-none')
    }, 1000)
    setIslike(false)
    dispatch(unlikePost(post))
  }

  const handleSavePost = () => {
    setIsSave(true)
    dispatch(savePost(post))
  }

  const handleUnsavePost = () => {
    setIsSave(false)
    dispatch(unsavePost(post))
  }

  useEffect(() => {}, [])

  // useEffect(() => {
  //   console.log('card footer mounted')
  // }, [])
  // useEffect(() => {
  //   return () => {
  //     console.log('card footer unmounted')
  //   }
  // }, [])
  // console.log(islike)
  return (
    <div className='px-5'>
      <div className='flex justify-between'>
        <div className='flex gap-6'>
          <div ref={likeRef} className={theme ? '' : 'invert-0'}>
            {islike ? (
              <BsHeartFill
                color='red'
                size={19}
                className='cursor-pointer   '
                onClick={unlike}
              />
            ) : (
              <BsHeart size={19} className='cursor-pointer' onClick={like} />
            )}
          </div>
          <BsChat
            onClick={() => navigate(`/post/${post._id}`)}
            size={19}
            className='cursor-pointer'
          />
          <BsSend
            size={19}
            className='cursor-pointer'
            onClick={() => setIsOpenShare(!isOpenShare)}
          />
        </div>
        <div
          ref={saveRef}
          onClick={() => {
            saveRef.current.classList.add('pointer-events-none')
            setTimeout(() => {
              saveRef.current.classList.remove('pointer-events-none')
            }, 500)
          }}
        >
          {isSave ? (
            <BsBookmarkFill
              size={19}
              className='cursor-pointer text-[#5ea8d6]'
              onClick={handleUnsavePost}
            />
          ) : (
            <BsBookmark
              size={19}
              className='cursor-pointer '
              onClick={handleSavePost}
            />
          )}
        </div>
      </div>
      <div className='flex justify-between text-[10px]'>
        <div
          className='hover:underline cursor-pointer'
          onClick={() => setOpenLikes(true)}
        >
          {post.likes.length} <span>likes</span>
        </div>
        <div className='hover:underline cursor-pointer'>
          {post.comments?.length} <span>comments</span>
        </div>
      </div>
      {isOpenShare && <Share url={`http://localhost:3000/post/${post._id}`} />}
      {openLikes && (
        <Followers
          users={post.likes.map(like => like.user)}
          setShowFollowers={setOpenLikes}
        />
      )}
    </div>
  )
}

export default CardFooter
