import React, { useEffect, useState } from 'react'
import Avatar from '../Avatar'
import { useNavigate } from 'react-router-dom'
import UserCard from '../UserCard'
import { getDataApi, postDataAPI } from '../../utils/fetchData'
import SearchOffIcon from '@mui/icons-material/SearchOff'
import SearchIcon from '@mui/icons-material/Search'
import { useDispatch, useSelector } from 'react-redux'
import {
  CONVERSATION_TYPES,
  createConversation
} from '../../redux/actions/conversationAction'

const LeftSide = () => {
  const { active } = useSelector(state => state.conversation)
  const { user } = useSelector(state => state.auth)
  const [term, setTerm] = useState('')
  const [users, setUsers] = useState([])
  const { conversations } = useSelector(state => state.conversation)
  const dispatch = useDispatch()
  useEffect(() => {
    if (term) {
      try {
        getDataApi(`user/search?term=${term}`)
          .then(response => {
            setUsers(response.data.users)
          })
          .catch(error => console.log(error))
      } catch (error) {
        console.log(error)
      }
    } else setUsers([])
  }, [term])
  const handleClickUser = user => {
    dispatch(createConversation(user))
  }
  return (
    <div className='w-full h-full '>
      <h1 className='font-[500] text-[20px] pt-3 pb-3 px-2'>Chats</h1>
      {/* <form action='' className=' px-2 relative '>
        <input
          type='text'
          required
          className=' rounded-md block w-full h-[40px]  focus:border-blue-500 focus:border focus:outline-none  px-1 bg-gray-100 '
          placeholder='Search '
        />
        <CiSearch className='absolute top-3 right-3' />
      </form> */}
      {/* <Search message={true} /> */}
      <div className='w-full p-2 relative'>
        <input
          placeholder='Search'
          className=' bg-gray-100 block w-full h-[35px] py-1  px-8 appearance-none rounded-[15px] focus:outline-none focus:border-blue-800 focus:border-[1px]'
          type='text'
          value={term}
          onChange={e => {
            setTerm(e.target.value)
          }}
        />
        {!term ? (
          <SearchIcon className='!text-gray-500 absolute top-4 left-4' />
        ) : (
          <SearchOffIcon
            onClick={() => {
              setTerm('')
            }}
            className='!text-gray-500 absolute top-4 left-4'
          />
        )}

        {users && users.length > 0 && (
          <div className='absolute  w-full min-h-[30vh] max-h-[60vh] p-2 bg-gray-50 shadow-md !z-50 rounded-md overflow-y-scroll'>
            {users &&
              users.map(user => (
                <div
                  onClick={() => {
                    handleClickUser(user)
                  }}
                >
                  <UserCard user={user} msg={true} />
                </div>
              ))}
          </div>
        )}
      </div>
      <div className='w-full  h-[calc(100vh-210px)] overflow-y-scroll'>
        {conversations.map(con => (
          <ConversationCard
            active={active}
            conversation={con}
            key={con._id}
            other={con.members.find(item => item._id !== user._id)}
            user={user}
            dispatch={dispatch}
          />
        ))}
      </div>
    </div>
  )
}

const ConversationCard = ({ conversation, other, active, dispatch }) => {
  const indexOfOther = conversation.members.indexOf(other)
  const indexOfUser = [0, 1].find(index => index !== indexOfOther)
  return (
    <div
      className={`w-full flex justify-start  items-start p-1 my-2 cursor-pointer ${
        active?._id === conversation._id && 'bg-gray-300'
      }`}
      onClick={() => {
        dispatch({
          type: CONVERSATION_TYPES.ACTIVE_CONVERSATION,
          payload: { _id: conversation._id, other }
        })
      }}
    >
      <Avatar url={other.avatar} size={'big-avatar'} />
      <div className='mx-1 flex flex-col justify-center'>
        <h1 className='font-[500]'>{other.username}</h1>
        <p
          className={`${
            conversation.seen[indexOfUser] === false
              ? 'text-gray-950'
              : 'text-gray-400'
          }`}
        >
          {conversation.text}{' '}
        </p>
      </div>
    </div>
  )
}
export default LeftSide
