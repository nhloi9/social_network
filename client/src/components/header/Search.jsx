import React, { useEffect, useState } from 'react'
import SearchIcon from '@mui/icons-material/Search'
import { getDataApi } from '../../utils/fetchData'
// import styles from '../../styles/styles';
import SearchOffIcon from '@mui/icons-material/SearchOff'
import UserCard from '../UserCard'

const Search = () => {
  const [term, setTerm] = useState('')
  const [users, setUsers] = useState([])
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

  return (
    <div className='w-full p-2 relative'>
      <input
        placeholder='Search'
        className=' block w-full h-[35px] py-1  px-8 appearance-none rounded-[15px] focus:outline-none focus:border-blue-800 focus:border-[1px]'
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
              // <Link
              // 	key={user._id}
              // 	onClick={() => {
              // 		setTerm('');
              // 	}}
              // 	to={`/profile/${user._id}`}
              // 	className="w-full h-[40px] my-3 p-1 flex cursor-pointer hover:bg-gray-300 rounded-md"
              // >
              // 	<Avatar
              // 		url={user.avatar}
              // 		size="medium-avatar"
              // 	/>
              // 	<div className="flex flex-col justify-center pl-2">
              // 		<h1 className="leading-4">{user.fullname}</h1>
              // 		<h1 className="leading-3 text-[12px]">{user.username}</h1>
              // 	</div>
              // </Link>
              <UserCard user={user} setTerm={setTerm} />
            ))}
        </div>
      )}
    </div>
  )
}

export default Search
