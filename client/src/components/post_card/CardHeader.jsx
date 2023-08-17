import React, { useState } from 'react'
import Avatar from '../Avatar'
import moment from 'moment'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import { Dropdown, Space } from 'antd'
import EditIcon from '@mui/icons-material/Edit'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import { Link, useNavigate } from 'react-router-dom'
import CreatePost from '../home/CreatePost'
import { useDispatch, useSelector } from 'react-redux'
import { deletePost } from '../../redux/actions/postAction'
// import { useDispatch } from 'react-redux'
// import { GLOBALTYPES } from '../../redux/actions/globalTypes'

const CardHeader = ({ post }) => {
  const [onEdit, setOnEdit] = useState(false)
  const { user } = useSelector(state => state.auth)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  // const dispatch = useDispatch()
  const editPost = () => {
    setOnEdit(true)
  }
  // useEffect(() => {
  //   if (onEdit) {
  //     dispatch({
  //       type: GLOBALTYPES.MODAL,
  //       payload: true
  //     })
  //   } else {
  //     dispatch({
  //       type: GLOBALTYPES.MODAL,
  //       payload: false
  //     })
  //   }
  // }, [onEdit, dispatch])
  const handleDeletePost = async () => {
    await dispatch(deletePost(post._id))
    navigate('/')
  }
  const handleCopy = () => {
    navigator.clipboard.writeText(`http://localhost:3000/post/${post._id}`)
    window.alert(`Copied `)
  }

  return (
    <div className='p-4 flex justify-between items-center'>
      <div className='flex'>
        <Link to={`/profile/${post.user?._id}`}>
          <Avatar url={post.user.avatar} size={'big-avatar'} />
        </Link>

        <div className='ml-2'>
          <Link to={`/profile/${post.user._id}`}>
            <h1 className='font-[500]'>{post.user.username}</h1>
          </Link>
          <p className='text-gray-500 text-[14px] '>
            {moment(post.createdAt).fromNow()}
          </p>
        </div>
      </div>
      <div>
        {user._id === post.user._id ? (
          <Dropdown
            menu={{
              items: [
                {
                  label: (
                    <div onClick={editPost}>
                      <EditIcon /> Edit Post
                    </div>
                  ),
                  key: '0'
                },
                {
                  label: (
                    <div onClick={handleDeletePost}>
                      <DeleteOutlineIcon /> Remove Post
                    </div>
                  ),
                  key: '1'
                },
                {
                  label: (
                    <div onClick={handleCopy}>
                      <ContentCopyIcon /> Copy Link
                    </div>
                  ),
                  key: '2'
                }
              ]
            }}
            trigger={['click']}
            placement='bottomRight'
          >
            <Space>
              <MoreHorizIcon fontSize='medium' className='cursor-pointer' />
            </Space>
          </Dropdown>
        ) : (
          <Dropdown
            menu={{
              items: [
                {
                  label: (
                    <div onClick={handleCopy}>
                      <ContentCopyIcon /> Copy Link
                    </div>
                  ),
                  key: '2'
                }
              ]
            }}
            trigger={['click']}
            placement='bottomRight'
          >
            <Space>
              <MoreHorizIcon fontSize='medium' className='cursor-pointer' />
            </Space>
          </Dropdown>
        )}
      </div>
      {onEdit && <CreatePost setOnCreatePost={setOnEdit} post={post} />}
    </div>
  )
}

export default CardHeader
