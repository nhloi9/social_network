import React, { useState } from 'react'
import CommentCard from './CommentCard'
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io'

const CommentDisplay = ({ comment, post, answere }) => {
  const [showAnsweres, setShowAnswres] = useState(false)
  return (
    <div className='mb-5'>
      <CommentCard comment={comment} post={post} />
      {answere.length > 0 && (
        <div
          className='flex items-center mx-[30px] gap-1 cursor-pointer text-blue-800'
          onClick={() => setShowAnswres(!showAnsweres)}
        >
          {showAnsweres ? (
            <IoIosArrowUp size={20} />
          ) : (
            <IoIosArrowDown size={20} />
          )}
          <span>{answere.length} replies</span>
        </div>
      )}
      {showAnsweres && (
        <div className='ml-[30px]'>
          {answere &&
            answere.map(cm => (
              <CommentCard key={cm._id} comment={cm} post={post} />
            ))}
        </div>
      )}
    </div>
  )
}

export default CommentDisplay
