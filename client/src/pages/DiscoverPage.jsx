import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { BsChat, BsHeart } from 'react-icons/bs'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { getDiscoverPosts } from '../redux/actions/discoverAction'
import LoadMoreBtn from '../components/LoadMoreBtn.jsx'

const DiscoverPage = () => {
  const dispatch = useDispatch()
  const { posts, first, page, loading, totalPage } = useSelector(
    state => state.discover
  )
  const theme = useSelector(state => state.theme)

  const handleLoadMore = () => {
    dispatch(getDiscoverPosts(page))
  }

  useEffect(() => {
    if (first) dispatch(getDiscoverPosts())
  }, [dispatch, first])

  return (
    <div className='w-full 1100px:w-[80%] mx-auto'>
      {!loading && posts.length === 0 ? (
        <div className='w-full text-center mt-[100px]'>No Post</div>
      ) : (
        <div className='grid grid-cols-1 gap-3  800px:grid-cols-2 1100px:grid-cols-3  w-full'>
          {posts.map(post => (
            <Link to={`/post/${post._id}`}>
              <div className='w-full h-[300px]  relative group'>
                <LazyLoadImage
                  className={`${
                    theme ? 'invert' : ''
                  } w-full h-full object-cover`}
                  src={post.images[0].url}
                  alt=''
                />
                <div className='absolute opacity-0 group-hover:opacity-[1]   top-0 w-full h-full bg-[#00000098] flex justify-center items-center gap-3 transition'>
                  <BsChat color='white' size={35} />
                  <span>{post.likes.length}</span>
                  <BsHeart color='white' size={35} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
      <LoadMoreBtn
        totalPage={totalPage}
        page={page}
        handleLoadMore={handleLoadMore}
        loading={loading}
      />
    </div>
  )
}

export default DiscoverPage
