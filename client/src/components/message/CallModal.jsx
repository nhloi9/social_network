import React, { useEffect, useState } from 'react'
import Avatar from '../Avatar'
import { MdCallEnd } from 'react-icons/md'
import { PiPhoneCallBold } from 'react-icons/pi'
import { useDispatch, useSelector } from 'react-redux'
import { CALL_TYPES } from '../../redux/actions/callAction'
import { peer } from '../../peer'

const CallModal = () => {
  const callData = useSelector(state => state.call)
  const { user } = useSelector(state => state.auth)
  const dispatch = useDispatch()

  const [answere, setAnswere] = useState(false)

  const handleAnswere = () => {
    // console.log({ callData, peer: window.peer })
    setAnswere(true)
    // window.peer.connect(callData.peerId)
    console.log(callData.peerId)
    navigator.mediaDevices
      .getUserMedia({ video: false, audio: true })
      .then(stream => {
        const call = peer.call(callData.peerId, stream)
        call.on('stream', remoteStream => {
          // Show stream in some <video> element.
        })
      })
  }

  const handleEndCall = () => {
    dispatch({ type: CALL_TYPES.CALL, payload: null })
  }
  useEffect(() => {
    let timeout
    if (!answere) {
      timeout = setTimeout(() => {
        dispatch({ type: CALL_TYPES.CALL, payload: null })
      }, 15000)
      if (answere) {
        clearTimeout(timeout)
      }
    }
    return () => clearTimeout(timeout)
  }, [dispatch, answere])

  useEffect(() => {
    peer.on('call', call => {
      // navigator.mediaDevices.getUserMedia(
      //   { video: true, audio: false },
      //   stream => {
      //     call.answer(stream)
      //   },
      //   err => {
      //     console.error('Failed to get local stream', err)
      //   }
      // )
      console.log(4)
      return () => peer.removeListener('call')
    })
  }, [])
  return (
    <div className=' fixed top-0 bottom-0 left-0 right-0 z-[999999999999999999999] bg-[#00000069] flex justify-center items-center text-gray-200'>
      {!answere && (
        <audio
          hidden
          controls
          autoPlay
          loop
          src={require('../../audio/muzee.mp3')}
        ></audio>
      )}
      <div className=' bg-blue-500 h-[80vh] w-full  max-w-[400px] rounded-md shadow-[0_0_5px_gray] flex flex-col items-center justify-between'>
        <div className=' flex flex-col items-center'>
          <div className=' pt-5 pb-2'>
            <Avatar url={callData.other.avatar} size={'large-avatar'} />
          </div>
          <h1 className=' text-[24px] font-[500] text-gray-100'>
            {callData.other.username}
          </h1>
          <h1>{callData.other.fullname}</h1>
          <br />
          <h1 className='text-white'>Calling...</h1>
        </div>
        <div className=' flex flex-col items-center pb-4'>
          {answere && <Timer />}
          <br />
          <div className='flex gap-6'>
            {callData.receiver === user._id && !answere && (
              <div
                className=' rounded-full  bg-green-500 p-1 cursor-pointer'
                onClick={handleAnswere}
              >
                <PiPhoneCallBold size={34} color='green' />
              </div>
            )}
            <div
              className=' rounded-full  bg-gray-300 p-1 cursor-pointer'
              onClick={handleEndCall}
            >
              <MdCallEnd size={34} color='red' />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const Timer = () => {
  const [minute, setMinute] = useState(0)
  const [seconds, setSeconds] = useState(0)
  const [time, setTime] = useState(0)
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(time => time + 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [])
  useEffect(() => {
    if (time) {
      setMinute(Math.floor(time / 60))
      setSeconds(time % 60)
    }
  }, [time])
  return (
    <div className='text-white  text-[12px]'>
      {minute < 10 ? '0' + minute : minute}:
      {seconds < 10 ? '0' + seconds : seconds}
    </div>
  )
}

export default CallModal
