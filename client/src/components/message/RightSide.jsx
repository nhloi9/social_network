import React, { useEffect, useRef, useState } from 'react'
import Avatar from '../Avatar'
import { BsMessenger, BsPlusCircle } from 'react-icons/bs'
import TextareaAutosize from 'react-textarea-autosize'
import EmojiSelect from '../EmojiSelect'
import { useDispatch, useSelector } from 'react-redux'
import { BiSend } from 'react-icons/bi'
import { addChat, createMessage } from '../../redux/actions/conversationAction'
import { format, startOfWeek } from 'date-fns'

const RightSide = () => {
  const textRef = useRef(null)
  const { active } = useSelector(state => state.conversation)
  const { chats } = useSelector(state => state.conversation)
  const dispatch = useDispatch()

  const [messages, setMessages] = useState([])
  const { user } = useSelector(state => state.auth)
  const listRef = useRef(null)

  //to force rerender
  const [key, setKey] = useState(0)
  const handleCreateMessage = e => {
    e.preventDefault()
    const message = {
      sender: user._id,
      receiver: active.other._id,
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
        setMessages([...chat.messages].reverse())
      } else {
        dispatch(addChat(active._id))
      }
    }
  }, [active?._id, chats, dispatch])
  useEffect(() => {
    listRef.current &&
      listRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'end'
      })
  }, [messages])
  return (
    <>
      {active ? (
        //using startofweek to check different weeks
        <div className=' flex flex-col w-full h-full p-3'>
          <div className=' w-full flex justify-start items-center pb-2 my-2 border-b'>
            <Avatar url={active.other.avatar} size={'big-avatar'} />
            <div className='mx-1 flex flex-col justify-center gap-[-3px]'>
              <h1 className='font-[500]'>{active.other.username}</h1>
              <p className='text-gray-400'>{active.other.fullname} </p>
            </div>
          </div>
          <div className='w-full py-2  h-full overflow-y-scroll'>
            {messages &&
              messages.map((message, index) => (
                <MessageCard
                  index={index}
                  key={message._id}
                  message={message}
                  user={user}
                  other={active.other}
                >
                  {index === 0 ||
                  startOfWeek(new Date(message.createdAt), {
                    weekStartsOn: 1
                  }).getDate() !==
                    startOfWeek(new Date(messages[index - 1].createdAt), {
                      weekStartsOn: 1
                    }).getDate() ? (
                    <div>
                      <h1 className=' text-[13px]'>
                        {format(new Date(message.createdAt), 'EEEE h:mm a')}
                      </h1>
                    </div>
                  ) : new Date(message.createdAt).getDate() !==
                    new Date(messages[index - 1].createdAt).getDate() ? (
                    <div className='w-full flex justify-center'>
                      <h1 className=' text-[13px]'>
                        {format(new Date(message.createdAt), 'EEEE h:mm a')}
                      </h1>
                    </div>
                  ) : (
                    // new Date(message.createdAt).getTime() -
                    //   new Date(messages[index - 1].createdAt).getTime() >
                    //   5 * 60 * 1000
                    new Date(message.createdAt).getMinutes() % 4 !==
                      new Date(messages[index - 1].createdAt).getMinutes() %
                        4 && (
                      <div className='w-full flex justify-center'>
                        <h1 className=' text-[13px]'>
                          {format(new Date(message.createdAt), 'h:mm a')}
                        </h1>
                      </div>
                    )
                  )}
                </MessageCard>
              ))}
            <div ref={listRef}></div>
          </div>
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
          <div className=' max-w-[60%] bg-blue-500 rounded-[15px] py-1 px-2  '>
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
          <div className=' max-w-[60%] bg-gray-300 rounded-[15px] py-1 px-2 mx-1 flex '>
            <p>{message.text}</p>
          </div>
        </div>
      </div>
    )
}
