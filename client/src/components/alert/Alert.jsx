import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import LinearProgress from '@mui/material/LinearProgress'
import { GLOBALTYPES } from '../../redux/actions/globalTypes'

const Alert = () => {
  const [loadingSuccess, setLoadingSuccess] = useState(false)
  const distpatch = useDispatch()

  const alert = useSelector(state => state.alert)
  useEffect(() => {
    if (alert.success) {
      toast.success(alert.success)
      distpatch({ type: GLOBALTYPES.ALERT, payload: {} })
    }
    if (alert.error) {
      toast.error(alert.error)
      distpatch({ type: GLOBALTYPES.ALERT, payload: {} })
    }
  }, [alert, distpatch])

  return (
    <div className='fixed top-0 w-full z-[9999999999999999999999999]'>
      <audio controls id='notification_sound' className='hidden'>
        <source
          src={require('../../audio/mixkit-achievement-bell-600.wav')}
          type='audio/ogg'
        />
      </audio>
      {alert.loading && <Loader setLoadingSuccess={setLoadingSuccess} />}
      {loadingSuccess && (
        <LinearProgress color='primary' variant='determinate' value={100} />
      )}
    </div>
  )
}
const Loader = ({ setLoadingSuccess }) => {
  const [progress, setProgress] = React.useState(0)
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(oldProgress => {
        // if (oldProgress === 100) {
        // 	return 0;
        // }
        const diff =
          oldProgress < 70
            ? Math.random() * 10
            : oldProgress < 90
            ? Math.random() * 5
            : Math.random() * 1
        return Math.min(oldProgress + diff, 97)
      })
    }, 100)

    return () => {
      clearInterval(timer)
      setLoadingSuccess(true)
      setTimeout(() => {
        setLoadingSuccess(false)
      }, 300)
      // set;
    }
  }, [setLoadingSuccess])
  return (
    <div className='fixed top-0 right-0  z-[9] left-0 bottom-0  bg-[#00000031]'>
      <div className=''>
        <LinearProgress variant='determinate' value={progress} />
      </div>
    </div>
  )
}

export default Alert
