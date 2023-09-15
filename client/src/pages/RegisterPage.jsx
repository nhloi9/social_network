import { Button } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye'
import { register } from '../redux/actions/authAction'
// import {validateRegister} from '../utils/register-validate';

const RegisterPage = () => {
  // const [err, setErr] = useState({});
  const navigate = useNavigate()
  const { token } = useSelector(state => state.auth)
  const dispatch = useDispatch()

  const [hidden, setHidden] = useState(true)
  const [hiddenCf, setHiddenCf] = useState(true)

  const [errPassword, setErrPassword] = useState('')
  const [errEmail, setErrEmail] = useState('')

  const initialUserData = {
    fullname: '',
    // userName: '',
    email: '',
    password: '',
    cfPassword: ''
  }
  const [userData, setUserData] = useState(initialUserData)
  const { fullname, email, password, cfPassword } = userData

  const handleChangeInput = e => {
    const { name, value } = e.target
    setUserData({ ...userData, [name]: value })
  }

  const validPassword = password => {
    if (password && !/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password)) {
      return 'Password must have minimum eight characters, at least one letter and one number '
    } else return ''
  }
  const validEmail = email => {
    if (email && !/^[\w.+-]+@gmail\.com$/.test(email)) {
      return 'Please enter a valid gmail'
    } else return ''
  }

  useEffect(() => {
    setErrPassword(validPassword(password))
  }, [password])

  useEffect(() => {
    setErrEmail(validEmail(email))
  }, [email])

  useEffect(() => {
    if (token) {
      navigate('/')
    }
  }, [token, navigate])

  const registerHandele = e => {
    e.preventDefault()
    if (errPassword === '' && errEmail === '') {
      // console.log(3);
      dispatch(register(userData))
    }
  }
  return (
    <div>
      <div className='w-full h-[100vh] flex items-center justify-center'>
        <div className='w-[400px] h-min border-gray-300 border px-[25px] pt-[30px] bg-slate-100 rounded-sm shadow-2xl overflow-y-scroll'>
          <div className='flex justify-center mb-[30px] '>
            <h1 className='text-3xl font-[500]'>Social Network</h1>
          </div>
          <form
            action=''
            onSubmit={registerHandele}
            className='w-full h-min mb-[30px]'
          >
            <div>
              <label htmlFor='fullname'>Full Name</label>
              <input
                name='fullname'
                id='fullname'
                required
                type='text'
                value={fullname}
                onChange={handleChangeInput}
                className='border border-gray-300 block w-full mt-2 py-1 px-2 appearance-none focus:ring-blue-500 focus:outline-none  focus:border-[1px] focus:border-blue-500 rounded-[4px] focus:shadow-md '
              />
            </div>
            {/* <div className="mt-4">
							<label htmlFor="userName">User Name</label>
							<input
								id="userName"
								name="userName"
								required
								type="text"
								value={userName}
								onChange={handleChangeInput}
								placeholder=""
								className="border border-gray-300 block w-full mt-2 py-1 px-2 appearance-none focus:ring-blue-500 focus:outline-none  focus:border-[1px] focus:border-blue-500 rounded-[4px] focus:shadow-md "
							/>
						</div> */}
            <div className='mt-4'>
              <label htmlFor='email'>Email Address</label>
              <input
                id='email'
                name='email'
                required
                type='email'
                value={email}
                onChange={handleChangeInput}
                placeholder=''
                className='border border-gray-300 block w-full mt-2 py-1 px-2 appearance-none focus:ring-blue-500 focus:outline-none  focus:border-[1px] focus:border-blue-500 rounded-[4px] focus:shadow-md '
              />
              <p className='text-[13px] text-red-500'>{errEmail}</p>
            </div>
            <div className=' mt-4 '>
              <label htmlFor='password '>Password</label>
              <div className='relative'>
                <input
                  id='password'
                  name='password'
                  required
                  value={password}
                  onChange={handleChangeInput}
                  type={hidden ? 'password' : 'text'}
                  className='border border-gray-300 block w-full mt-2 py-1 px-2 appearance-none focus:ring-blue-500 focus:outline-none  focus:border-[1px] focus:border-blue-500 rounded-[4px] focus:shadow-md '
                />
                {hidden ? (
                  <VisibilityOffIcon
                    className='absolute top-1 right-1 cursor-pointer  '
                    onClick={() => setHidden(!hidden)}
                    color='disabled'
                  />
                ) : (
                  <RemoveRedEyeIcon
                    className='absolute top-1 right-1 cursor-pointer  '
                    onClick={() => setHidden(!hidden)}
                    color='disabled'
                  />
                )}
              </div>
              <p className='text-[13px] text-red-500'>{errPassword}</p>
            </div>
            <div className=' mt-4 '>
              <label htmlFor='cfPassword '>Confirm Password</label>
              <div className='relative'>
                <input
                  id='cfPassword'
                  name='cfPassword'
                  required
                  value={cfPassword}
                  onChange={handleChangeInput}
                  type={hiddenCf ? 'password' : 'text'}
                  className='border border-gray-300 block w-full mt-2 py-1 px-2 appearance-none focus:ring-blue-500 focus:outline-none  focus:border-[1px] focus:border-blue-500 rounded-[4px] focus:shadow-md '
                />
                {hiddenCf ? (
                  <VisibilityOffIcon
                    className='absolute top-1 right-1 cursor-pointer  '
                    onClick={() => setHiddenCf(!hiddenCf)}
                    color='disabled'
                  />
                ) : (
                  <RemoveRedEyeIcon
                    className='absolute top-1 right-1 cursor-pointer  '
                    onClick={() => setHiddenCf(!hiddenCf)}
                    color='disabled'
                  />
                )}
              </div>
            </div>
            <div className='mt-4 flex justify-between'>
              <div className='flex items-center '>
                <label htmlFor='male' className='mr-1'>
                  Male
                </label>
                <input
                  type='radio'
                  name='gender'
                  value='male'
                  id='male'
                  className='translate-y-[2px]  w-3 h-3 '
                  onChange={handleChangeInput}
                />
              </div>
              <div className='flex items-center '>
                <label htmlFor='female' className='mr-1'>
                  Female
                </label>
                <input
                  type='radio'
                  name='gender'
                  value='female'
                  id='female'
                  className='translate-y-[2px]  w-3 h-3 '
                  onChange={handleChangeInput}
                />
              </div>
              <div className='flex items-center '>
                <label htmlFor='other' className='mr-1'>
                  Other
                </label>
                <input
                  required
                  type='radio'
                  name='gender'
                  value='other'
                  id='other'
                  className='translate-y-[2px]  w-3 h-3 '
                  onChange={handleChangeInput}
                />
              </div>
            </div>
            <Button
              type='submit'
              variant='outlined'
              className='w-full !mt-[30px] block !mb-2'
            >
              Login
            </Button>
            <div className='flex'>
              <h1>You don't have an acount?</h1>
              <Link
                to={'/'}
                className='ml-2 block cursor-pointer text-blue-700'
              >
                Register
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
