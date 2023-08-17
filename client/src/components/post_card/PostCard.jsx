import React from 'react'
import CardHeader from './CardHeader'
import CardBody from './CardBody'
import CardFooter from './CardFooter'
import InputComment from './InputComment.jsx'
import Comments from './Comments.jsx'

const PostCard = ({ post }) => {
  // console.log(post)
  // useEffect(() => {
  //   console.log('post change')
  // }, [post])
  // useEffect(() => {
  //   return () => {
  //     console.log('unmout')
  //   }
  // }, [])
  return (
    // w-[calc(100%-5px)]
    <div className=' min-h-[100px]  mt-3   shadow-[0_0_1px] hover:shadow-[0_0_2px_gray]  rounded-sm bg-slate-50  mx-auto'>
      <CardHeader post={post} />
      <CardBody post={post} />
      <CardFooter post={post} />
      <InputComment post={post} />

      <Comments post={post} />
    </div>
  )
}

export default PostCard
