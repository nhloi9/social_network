import React, { useState } from 'react'
import EmojiPicker from 'emoji-picker-react'
import { useSelector } from 'react-redux'

const EmojiSelect = ({ textRef, css }) => {
  const [openPicker, setOpenPicker] = useState(false)
  const theme = useSelector(state => state.theme)

  return (
    <div
      className='cursor-pointer relative h-[20px] '
      onClick={e => {
        e.stopPropagation()
        setOpenPicker(!openPicker)
        textRef.current.focus()
      }}
    >
      😀
      {openPicker && (
        <div
          className={`absolute z-[5000] ${
            // right ? ' right-6' : bottom ? 'bottom-2' : 'left-2'
            css
          } ${theme ? 'invert' : ''} z-[1000]`}
          onClick={e => {
            e.stopPropagation()
          }}
          onMouseOver={() => {
            textRef.current.focus()
          }}
        >
          <EmojiPicker
            height='400px'
            autoFocusSearch={false}
            onEmojiClick={e => {
              const currentValue = textRef.current.value
              const start = textRef.current.selectionStart
              const end = textRef.current.selectionEnd
              textRef.current.value =
                currentValue.slice(0, start) + e.emoji + currentValue.slice(end)
              textRef.current.focus()

              textRef.current.setSelectionRange(
                start + e.emoji.length,
                start + e.emoji.length
              )
            }}
          />
        </div>
      )}
    </div>
  )
}

export default EmojiSelect
