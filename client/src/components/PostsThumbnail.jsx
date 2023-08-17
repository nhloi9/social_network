import React from 'react'
import { Link } from 'react-router-dom'
import { BsChat, BsHeart } from 'react-icons/bs'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { useSelector } from 'react-redux'

const PostsThumbnail = ({ posts }) => {
  const theme = useSelector(state => state.theme)

  return (
    <div className='grid grid-cols-1 gap-3  800px:grid-cols-2 1100px:grid-cols-3 max-w-[1000px] mx-auto'>
      {posts.map(post => (
        <Link to={`/post/${post._id}`}>
          <div className='w-full h-[300px]  relative group'>
            <LazyLoadImage
              className={`${theme ? 'invert' : ''} w-full h-full object-cover`}
              src={post.images[0].url}
              alt=''
            />
            <div className='absolute opacity-0 group-hover:opacity-[1]   top-0 w-full h-full bg-[#00000098] flex justify-center items-center gap-7 transition'>
              <div className='text-center'>
                <BsChat color='white' size={35} />
                <span className='text-white text-[20px]'>
                  {post.comments.length}
                </span>
              </div>
              <div className='text-center'>
                <BsHeart color='white' size={35} />
                <span className='text-white text-[20px]'>
                  {post.likes.length}
                </span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}

export default PostsThumbnail
