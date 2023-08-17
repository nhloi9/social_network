import React, { useEffect, useState } from 'react'
import CommentDisplay from './CommentDisplay'

const Comments = ({ post }) => {
  const [firstLevelComments, setFirstLevelComments] = useState([])
  const [showComments, setShowComments] = useState([])
  const [showCount, setShowCount] = useState(2)
  useEffect(() => {
    const comments = [...post.comments].sort((a, b) => {
      let condition =
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      return condition
    })
    // console.log(comments)
    setFirstLevelComments(comments.filter(comment => !comment.reply))
  }, [post.comments])
  useEffect(() => {
    setShowComments(firstLevelComments.slice(0, showCount))
  }, [firstLevelComments, showCount])
  // console.log({ showComments })
  return (
    <div className='p-4'>
      {showComments?.map(comment => (
        <CommentDisplay
          key={comment._id}
          comment={comment}
          post={post}
          answere={
            post.comments.filter(
              item => item.reply && item.reply === comment._id
            )
            // .sort((a, b) => {
            //   let condition =
            //     new Date(b.createdAt).getTime() -
            //     new Date(a.createdAt).getTime()
            //   return condition
            // })
          }
        />
      ))}

      {firstLevelComments?.length > 2 && (
        <div className=' border-y border-gray-300 py-2'>
          {showCount < firstLevelComments.length ? (
            <span
              className='text-red-500 cursor-pointer'
              onClick={() => {
                setShowCount(pre => pre + 3)
              }}
            >
              show more comments...
            </span>
          ) : (
            <span
              className='text-red-500 cursor-pointer'
              onClick={() => {
                setShowCount(2)
              }}
            >
              hidden comments...
            </span>
          )}
        </div>
      )}
    </div>
  )
}

export default Comments
