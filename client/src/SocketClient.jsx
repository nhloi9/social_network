import React, { useEffect } from 'react'
import { socket } from './socket'
import { useDispatch, useSelector } from 'react-redux'
import { POST_TYPES, receiveComment } from './redux/actions/postAction'

const SocketClient = () => {
  const { posts } = useSelector(state => state.homePost)

  const dispatch = useDispatch()

  useEffect(() => {
    socket.on('connect', () => {
      socket.emit(
        'join_post',
        posts.map(post => post._id)
      )
    })
  }, [posts])

  useEffect(() => {
    socket.emit(
      'join_post',
      posts.map(post => post._id)
    )
  }, [posts])
  useEffect(() => {
    socket.connect()
    socket.on('comment', comment => {
      dispatch(receiveComment(comment))
    })
  }, [dispatch])

  return <></>
}

export default SocketClient
