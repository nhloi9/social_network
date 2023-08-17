import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import PostsThumbnail from '../PostsThumbnail'

const ProfilePosts = ({ id }) => {
  const { profile } = useSelector(state => state)
  const [posts, setPosts] = useState([])
  useEffect(() => {
    setPosts(profile.posts.find(item => item._id === id)?.posts || [])
  }, [setPosts, id, profile?.posts])
  // console.log(posts)
  return <PostsThumbnail posts={posts} />
}

export default ProfilePosts
