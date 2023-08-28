import { Button } from 'antd'
import React, { useRef, useState } from 'react'
// import EmojiPicker from 'emoji-picker-react'
import { useDispatch } from 'react-redux'
import { createComment } from '../../redux/actions/postAction'
import EmojiSelect from '../EmojiSelect'

const InputComment = ({ post, comment, setOpen }) => {
  // const [openPicker, setOpenPicker] = useState(false)
  const [focus, setFocus] = useState(false)
  const dispatch = useDispatch()

  const textRef = useRef(null)

  const handleComment = () => {
    if (textRef.current.value && textRef.current.value.trim()) {
      dispatch(
        createComment({
          content: textRef.current.value,
          post,
          commentRep: comment
        })
      )
      setFocus(false)
      textRef.current.value = ''
      if (setOpen) setOpen(false)
    }
  }

  return (
    <div className='px-4 py-1 flex'>
      {comment && (
        <div className='translate-y-1 font-[500] mr-1'>
          {'@' + comment.user.username}
        </div>
      )}
      <div className='w-full'>
        <input
          ref={textRef}
          onClick={() => setFocus(true)}
          type='text'
          className='block p-1 w-full outline-none border-b border-gray-400 focus:border-b-2 focus:border-gray-700 '
          placeholder='Add your comment... '
        />
        {focus && (
          <div className='flex justify-between py-2 relative'>
            {/* <div
              className='cursor-pointer '
              onClick={() => setOpenPicker(!openPicker)}
            >
              😀
            </div>
            {openPicker && (
              <div
                className='absolute left-8 z-[500000000000000000000000000000000000000]'
                onMouseOver={() => {
                  textRef.current.focus()
                }}
              >
                <EmojiPicker
                  onEmojiClick={e => {
                    const currentValue = textRef.current.value
                    const start = textRef.current.selectionStart
                    const end = textRef.current.selectionEnd
                    textRef.current.value =
                      currentValue.slice(0, start) +
                      e.emoji +
                      currentValue.slice(end)
                    textRef.current.focus()

                    textRef.current.setSelectionRange(
                      start + e.emoji.length,
                      start + e.emoji.length
                    )
                  }}
                />
              </div>
            )} */}
            <EmojiSelect textRef={textRef} css={'left-2'} />
            <div>
              <Button
                type='text l-2 '
                className='!mr-2'
                onClick={() => setFocus(false)}
              >
                Cancel
              </Button>
              <Button
                type='text'
                className='!font-[500]'
                onClick={handleComment}
              >
                Comment
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default InputComment
