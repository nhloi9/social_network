import React, { useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
// import InfiniteScroll from 'react-infinite-scroller'
import InfiniteScroll from 'react-infinite-scroll-component'
import Lottie from 'react-lottie'

import PostCard from '../post_card/PostCard'
import { getPosts } from '../../redux/actions/postAction'
import * as animationData from '../../animation/animation_ll70lfkr.json'

const Posts = () => {
  const dispatch = useDispatch()
  const { page } = useSelector(state => state.homePost)
  const { posts } = useSelector(state => state.homePost)
  const scrollRef = useRef(null)
  const loadFunc = () => {
    dispatch(getPosts(page))
  }
  return (
    <div className='' ref={scrollRef}>
      {/* {posts.length === 0 ? (
        <div className='flex justify-center mt-[100px] text-[17px] font-[500]'>
          No Posts
        </div>
      ) : ( */}
      <InfiniteScroll
        scrollThreshold={'10px'}
        endMessage={
          <p style={{ textAlign: 'center' }}>
            <b>Yay! You have seen it all</b>
          </p>
        }
        dataLength={posts.length}
        next={loadFunc}
        hasMore={true}
        loader={
          <div className='flex justify-center pointer-events-none '>
            <Lottie width={50} height={50} options={{ animationData }}></Lottie>
          </div>
        }
      >
        {posts.map((post, index) => (
          <PostCard key={post._id} post={post} />
        ))}
      </InfiniteScroll>
      {/* )} */}
    </div>
  )
}

export default Posts
