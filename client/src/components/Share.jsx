import React from 'react'
import {
  FacebookShareButton,
  FacebookIcon,
  TwitterShareButton,
  TelegramIcon,
  EmailShareButton,
  EmailIcon,
  TwitterIcon,
  TelegramShareButton
} from 'react-share'

const Share = ({ url }) => {
  return (
    <div className='w-full flex justify-between items-center h-[40px]'>
      <FacebookShareButton
        url='https://www.youtube.com/watch?v=HSOtku1j600&list=WL&index=1&t=3960s'
        children={<FacebookIcon size={26} className='rounded-full' />}
      />
      <TwitterShareButton
        children={<TwitterIcon size={26} className='rounded-full' />}
      />
      <EmailShareButton
        children={<EmailIcon size={26} className='rounded-full' />}
      />
      <TelegramShareButton
        children={<TelegramIcon size={26} className='rounded-full' />}
      />
    </div>
  )
}

export default Share
