import React, { useEffect, useRef, useState } from 'react'
import Avatar from '../Avatar'
import { BsHeart, BsHeartFill } from 'react-icons/bs'
import moment from 'moment'
import InputComment from './InputComment'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Dropdown } from 'antd'
import { AiOutlineMore } from 'react-icons/ai'
import EditIcon from '@mui/icons-material/Edit'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import {
  deleteComment,
  likeComment,
  unlikeComment,
  updateComment
} from '../../redux/actions/postAction'

const CommentCard = ({ comment, post }) => {
  const editRef = useRef(null)
  const navigate = useNavigate()
  const likeRef = useRef(null)
  const dispatch = useDispatch()
  const { user } = useSelector(state => state.auth)

  const [onEdit, setOnEdit] = useState(false)
  const [openReply, setOpenReply] = useState(false)
  const [readMore, setReadMore] = useState(false)
  const [isLike, setIsLike] = useState(false)

  //update comment
  const handleUpdateComment = () => {
    if (editRef.current.value !== comment.value) {
      dispatch(updateComment(comment, post, editRef.current.value))
    }
    setOnEdit(false)
  }

  //like comment
  const handleLikeComment = () => {
    setIsLike(true)
    dispatch(likeComment(comment, post))
  }

  //unlike comment
  const handleUnlikeComment = () => {
    setIsLike(false)
    dispatch(unlikeComment(comment, post))
  }

  // delete comment
  const handleDelete = () => {
    dispatch(deleteComment(comment, post))
  }

  useEffect(() => {
    if (comment.likes.find(item => item._id === user._id)) {
      setIsLike(true)
    } else setIsLike(false)
  }, [setIsLike, user?._id, comment?.likes])
  return (
    <div
      className={`my-2 ${
        !comment._id && 'opacity-30 pointer-events-none'
      } group ${comment.updating ? 'opacity-40 pointer-events-none' : ''}`}
    >
      <div className='flex gap-1'>
        <Avatar url={comment.user.avatar} size='small-avatar' />
        <h1 className='font-[500] translate-y-[-3px]'>
          {comment.user.username}
        </h1>
      </div>
      <div className=' mt-[1px] p-2 w-full rounded-b-md rounded-tr-md bg-gray-300 min-h-[30px] flex items-center gap-2'>
        {onEdit ? (
          <div className='w-full'>
            <textarea
              ref={editRef}
              name=''
              id=''
              className=' w-full outline-none p-2'
            ></textarea>
            <div className='flex justify-end gap-4 text-[14px]  '>
              <span
                className='text-red-400 cursor-pointer'
                onClick={() => {
                  setOnEdit(false)
                }}
              >
                cancel
              </span>
              <span
                className=' cursor-pointer text-green-500'
                onClick={handleUpdateComment}
              >
                update
              </span>
            </div>
          </div>
        ) : (
          <div className='w-full'>
            <p>
              {comment.tag && comment.tag._id !== comment.user._id ? (
                <span
                  className='font-[500] mr-1 cursor-pointer'
                  onClick={() => navigate(`/profile/${comment.tag._id}`)}
                >
                  @{comment.tag.username}
                </span>
              ) : (
                ''
              )}
              {comment.content.length > 45 && !readMore
                ? comment.content.slice(0, 45)
                : comment.content}
              {comment.content.length > 45 ? (
                readMore ? (
                  <span
                    className='text-red-500 cursor-pointer'
                    onClick={() => setReadMore(false)}
                  >
                    {' '}
                    hidden
                  </span>
                ) : (
                  <span
                    className='text-red-500 cursor-pointer'
                    onClick={() => setReadMore(true)}
                  >
                    {' '}
                    ...read more
                  </span>
                )
              ) : (
                ''
              )}
            </p>
            <div className='flex gap-3 text-[13px] mt-1'>
              <h1>{moment(comment.createdAt).fromNow()}</h1>
              <h1 className='font-[500]'>
                {comment.likes.length} <span>likes</span>
              </h1>
              <h1
                className='font-[500] cursor-pointer'
                onClick={() => {
                  setOpenReply(!openReply)
                }}
              >
                {openReply ? 'cancel' : 'reply'}
              </h1>
            </div>
          </div>
        )}
        <div className='flex justify-end gap-2 w-[50px]'>
          <div className='hidden  group-hover:block'>
            {comment.user._id === user._id ? (
              <Dropdown
                menu={{
                  items: [
                    {
                      label: (
                        <div
                          onClick={() => {
                            setOnEdit(true)
                            setTimeout(() => {
                              editRef.current.value = comment.content
                              editRef.current.focus()
                            }, 100)
                          }}
                        >
                          <EditIcon /> Edit Comment
                        </div>
                      ),
                      key: '0'
                    },
                    {
                      label: (
                        <div onClick={handleDelete}>
                          <DeleteOutlineIcon /> Remove Comment
                        </div>
                      ),
                      key: '1'
                    }
                  ]
                }}
              >
                <AiOutlineMore size={18} className='cursor-pointer' />
              </Dropdown>
            ) : post.user._id === user._id ? (
              <Dropdown
                menu={{
                  items: [
                    {
                      label: (
                        <div onClick={handleDelete}>
                          <DeleteOutlineIcon /> Remove Comment
                        </div>
                      ),
                      key: '1'
                    }
                  ]
                }}
              >
                <AiOutlineMore size={18} className='cursor-pointer' />
              </Dropdown>
            ) : (
              ''
            )}
          </div>
          <div
            className=''
            ref={likeRef}
            onClick={() => {
              likeRef.current.classList.add('pointer-events-none')
              setTimeout(() => {
                likeRef.current.classList.remove('pointer-events-none')
              }, 1000)
            }}
          >
            {isLike ? (
              <BsHeartFill
                color='red'
                size={19}
                className='cursor-pointer'
                onClick={handleUnlikeComment}
              />
            ) : (
              <BsHeart
                size={19}
                className='cursor-pointer '
                onClick={handleLikeComment}
              />
            )}
          </div>
        </div>
      </div>
      {openReply && (
        <InputComment post={post} comment={comment} setOpen={setOpenReply} />
      )}
    </div>
  )
}

export default CommentCard
