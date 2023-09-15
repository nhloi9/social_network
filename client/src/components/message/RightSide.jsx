import React, { useEffect, useRef, useState } from 'react'
import Avatar from '../Avatar'
import { BsMessenger, BsPlusCircle } from 'react-icons/bs'
import TextareaAutosize from 'react-textarea-autosize'
import EmojiSelect from '../EmojiSelect'
import { useDispatch, useSelector } from 'react-redux'
import { BiSend } from 'react-icons/bi'
import InfiniteScroll from 'react-infinite-scroll-component'
import { IoCall } from 'react-icons/io5'
import { FcVideoCall } from 'react-icons/fc'
import {
  CONVERSATION_TYPES,
  addChat,
  createMessage,
  loadMoreMessages
} from '../../redux/actions/conversationAction'
import { format, startOfWeek } from 'date-fns'
import * as animationData from '../../animation/animation_ll70lfkr.json'
import Lottie from 'react-lottie'
import { CALL_TYPES } from '../../redux/actions/callAction'
import { socket } from '../../socket'
import { peer } from '../../peer'

const RightSide = () => {
  const textRef = useRef(null)
  const { active } = useSelector(state => state.conversation)
  const { chats, conversations } = useSelector(state => state.conversation)
  const dispatch = useDispatch()

  const [seen, setSeen] = useState(false)
  const [chat, setChat] = useState(null)
  const { user } = useSelector(state => state.auth)
  const listRef = useRef(null)

  //to force rerender
  const [key, setKey] = useState(0)
  const handleCreateMessage = e => {
    e.preventDefault()
    const message = {
      sender: {
        _id: user._id,
        fullname: user.fullname,
        username: user.username,
        avatar: user.avatar
      },
      receiver: active.other,
      text: textRef.current.value,
      conversation: active._id
    }

    dispatch(createMessage(message))
    textRef.current.value = ''
  }
  useEffect(() => {
    if (active?._id) {
      const chat = chats.find(item => item._id === active._id)
      if (chat) {
        // setMessages([...chat.messages].reverse())
        setChat(chat)
      } else {
        dispatch(addChat(active._id))
      }
    }
  }, [active?._id, chats, dispatch])

  //scroll to bottom when have a new message
  const lasteMessageId = chat?.messages[0]?._id
  useEffect(() => {
    listRef.current &&
      listRef.current.scrollIntoView({
        behavior: 'instant',
        // behavior: 'smooth',
        block: 'end',
        inline: 'nearest'
      })
  }, [lasteMessageId, seen, active?._id])

  useEffect(() => {
    if (active) {
      const conversation = conversations.find(item => item._id === active._id)
      const indexOfOther = conversation.members.findIndex(
        member => member._id === active.other._id
      )
      setSeen(conversation.seen[indexOfOther])
    }
  }, [active?._id, active?.other._id, conversations, active])

  //delete active chat
  useEffect(() => {
    return () =>
      dispatch({
        type: CONVERSATION_TYPES.ACTIVE_CONVERSATION,
        payload: null
      })
  }, [dispatch])

  // call
  const handleCall = ({ video }) => {
    const msg = {
      sender: user._id,
      receiver: active.other._id,
      other: active.other,
      video
    }
    dispatch({ type: CALL_TYPES.CALL, payload: msg })
    const { _id, username, fullname, avatar } = user
    socket.emit('call', {
      sender: user._id,
      receiver: active.other._id,
      other: { _id, username, fullname, avatar },
      video,
      peerId: peer?._id
    })
  }

  return (
    <>
      {active ? (
        //using startofweek to check different weeks
        <div className=' flex flex-col w-full h-full p-3 pr-1 right-side'>
          <div className=' w-full flex justify-between items-center pb-2 my-2 border-b'>
            <div className='flex'>
              <Avatar url={active.other.avatar} size={'big-avatar'} />
              <div className='mx-1 flex flex-col justify-center gap-[-3px]'>
                <h1 className='font-[500]'>{active.other.username}</h1>
                <p className='text-gray-400'>{active.other.fullname} </p>
              </div>
            </div>
            <div className='flex gap-3 pr-3'>
              <IoCall
                color='green'
                size={23}
                className='cursor-pointer'
                onClick={() => {
                  handleCall({ video: false })
                }}
              />
              <FcVideoCall
                color='green'
                size={23}
                onClick={() => handleCall({ video: true })}
                className=' cursor-pointer'
              />
            </div>
          </div>

          {/* display list messages */}
          <div
            className='w-full py-2  h-full  overflow-y-auto  '
            id='scrollableDiv'
            style={{ display: 'flex', flexDirection: 'column-reverse' }}
          >
            <div ref={listRef} className='pt-1'></div>
            <div className='flex justify-end pr-3'>
              {seen && (
                <Avatar url={active.other.avatar} size={'micro-avatar'} />
              )}
            </div>
            <InfiniteScroll
              scrollableTarget='scrollableDiv'
              hasMore={true}
              dataLength={chat?.messages.length || 0}
              loader={
                chat?.cusorTime !== null && (
                  <div className='flex justify-center pointer-events-none '>
                    <Lottie
                      width={50}
                      height={50}
                      options={{ animationData }}
                    ></Lottie>
                  </div>
                )
              }
              style={{ display: 'flex', flexDirection: 'column-reverse' }} //To put endMessage and loader to the top.
              endMessage={
                <p style={{ textAlign: 'center' }}>
                  <b>Yay! You have seen it all</b>
                </p>
              }
              inverse={true} //
              next={() => {
                console.log(1)
                dispatch(loadMoreMessages(active._id))
              }}
            >
              {chat?.messages &&
                chat.messages.map((message, index) => (
                  <MessageCard
                    index={index}
                    key={message._id}
                    message={message}
                    user={user}
                    other={active.other}
                  >
                    {index === chat?.messages.length - 1 ||
                    startOfWeek(new Date(message.createdAt), {
                      weekStartsOn: 1
                    }).getDate() !==
                      startOfWeek(
                        new Date(chat?.messages[index + 1].createdAt),
                        {
                          weekStartsOn: 1
                        }
                      ).getDate() ? (
                      <div className='w-full flex justify-center'>
                        <h1 className=' text-[13px]'>
                          {format(
                            new Date(message.createdAt),
                            'MMMM d, h:mm a'
                          )}
                        </h1>
                      </div>
                    ) : new Date(message.createdAt).getDate() !==
                      new Date(
                        chat?.messages[index + 1].createdAt
                      ).getDate() ? (
                      <div className='w-full flex justify-center'>
                        <h1 className=' text-[13px]'>
                          {format(new Date(message.createdAt), 'EEEE h:mm a')}
                        </h1>
                      </div>
                    ) : (
                      // new Date(message.createdAt).getTime() -
                      //   new Date(messages[index - 1].createdAt).getTime() >
                      //   5 * 60 * 1000
                      Math.floor(
                        new Date(message.createdAt).getMinutes() / 15
                      ) !==
                        Math.floor(
                          new Date(
                            chat?.messages[index + 1].createdAt
                          ).getMinutes() / 15
                        ) && (
                        <div className='w-full flex justify-center'>
                          <h1 className=' text-[13px]'>
                            {format(new Date(message.createdAt), 'h:mm a')}
                          </h1>
                        </div>
                      )
                    )}
                  </MessageCard>
                ))}
            </InfiniteScroll>
          </div>

          {/* input message */}
          <form
            className=' w-full h-min flex items-end gap-1 mt-1 '
            onSubmit={handleCreateMessage}
          >
            <BsPlusCircle className='mb-2' />
            <div className=' rounded-[17px]  w-full h-min  border border-gray-400   px-1  flex items-end '>
              <TextareaAutosize
                onChange={() => setKey(cur => cur + 1)}
                ref={textRef}
                className=' rounded-lg  border-none focus:outline-none  w-full min-h-[30px] my-1 pt-[2px] bg-slate-50 px-[6px] resize-none'
              />
              <div className='pb-2'>
                <EmojiSelect textRef={textRef} css='bottom-6 right-1' />
              </div>
            </div>
            <button type='submit' className='mb-2 appearance-none'>
              <BiSend
                size={20}
                className={`${
                  textRef.current?.value && 'cursor-pointer text-gray-900'
                } text-gray-500 cursor-default`}
              />
            </button>
          </form>
        </div>
      ) : (
        <div className=' flex  w-full h-full  justify-center items-center'>
          <BsMessenger size={35} color='blue' />
        </div>
      )}
    </>
  )
}

export default RightSide

const MessageCard = ({ message, user, other, children, index }) => {
  if (message.sender === user._id) {
    return (
      <div className='p-2  w-full'>
        {children}
        <div className='flex justify-end '>
          <div
            className={`${
              message._id ? '' : 'opacity-50 !bg-gray-200'
            } max-w-[60%] bg-[#A8DDFD] rounded-[10px] py-1 px-2  min-w-[30px]  overflow-hidden`}
          >
            {message.text}
          </div>
        </div>
      </div>
    )
  } else
    return (
      <div>
        {children}
        <div className='flex justify-start my-2  w-full '>
          <Avatar url={other.avatar} size={'medium-avatar'} />
          <div className=' max-w-[60%] !bg-gray-300 rounded-[10px]  py-1 px-2 mx-1 flex  min-w-[30px]  overflow-hidden '>
            <p>{message.text}</p>
          </div>
        </div>
      </div>
    )
}
