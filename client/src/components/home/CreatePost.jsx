import CloseIcon from '@mui/icons-material/Close'
// import EmojiPicker from 'emoji-picker-react'
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate'
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto'
import { Button } from 'antd'
import { toast } from 'react-toastify'
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle'
import {
  POST_TYPES,
  createPost,
  updatePost
} from '../../redux/actions/postAction'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useRef, useState } from 'react'
import EmojiSelect from '../EmojiSelect'

const CreatePost = ({ setOnCreatePost, post }) => {
  const { user } = useSelector(state => state.auth)
  const { success } = useSelector(state => state.homePost)
  const [tracks, setTracks] = useState(null)
  const dispatch = useDispatch()
  const { theme } = useSelector(state => state)
  const [openCamera, setOpenCamera] = useState(false)
  // const [openPicker, setOpenPicker] = useState(false)
  const textareRef = useRef(null)
  const [images, setImages] = useState([])
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  // const handleSelectEmoji = emoji => {
  //   const textarea = textareRef.current
  //   const startPosition = textarea.selectionStart
  //   const endPosition = textarea.selectionEnd
  //   const currentContent = textarea.value
  //   const newContent =
  //     currentContent.substring(0, startPosition) +
  //     emoji.emoji +
  //     currentContent.substring(endPosition)
  //   textareRef.current.value = newContent
  //   textareRef.current.focus()
  //   textareRef.current.setSelectionRange(
  //     startPosition + emoji.emoji.length,
  //     startPosition + emoji.emoji.length
  //   )
  // }
  const imgShow = image => {
    const videoRegex = /video/

    if (videoRegex.test(image.type)) {
      return (
        <video
          controls
          muted
          src={image.url ? image.url : URL.createObjectURL(image)}
          alt=''
          className={`${
            theme ? 'invert' : 'invert-0'
          } block w-full h-full object-contain`}
        />
      )
    } else
      return (
        <img
          src={image.url ? image.url : URL.createObjectURL(image)}
          alt=''
          className={`${
            theme ? 'invert' : 'invert-0'
          } block w-full h-full object-contain`}
        />
      )
  }

  useEffect(() => {
    if (success === 'update_post' || success === 'create_post') {
      setOnCreatePost(false)
      dispatch({ type: POST_TYPES.CLEAR })
    }
  }, [success, setOnCreatePost, dispatch])

  const handleCreatePost = () => {
    if (images.length === 0) {
      toast.error('please select an image')
    } else {
      endStream()
      if (post) {
        dispatch(
          updatePost({
            content: textareRef.current.value,
            photos: images,
            post
          })
        )
      } else {
        dispatch(
          createPost({ content: textareRef.current.value, photos: images })
        )
      }
      setOnCreatePost(false)
    }
  }
  const endStream = () => {
    setOpenCamera(false)
    tracks?.forEach(track => track.stop())
  }
  function dataURLtoFile (dataURL, filename) {
    const arr = dataURL.split(',')
    const mimeMatch = arr[0].match(/:(.*?);/)
    const mime = mimeMatch && mimeMatch.length >= 2 ? mimeMatch[1] : 'image/png'

    const byteString = atob(arr[1])
    const arrayBuffer = new ArrayBuffer(byteString.length)
    const uint8Array = new Uint8Array(arrayBuffer)

    for (let i = 0; i < byteString.length; i++) {
      uint8Array[i] = byteString.charCodeAt(i)
    }

    const blob = new Blob([arrayBuffer], { type: mime })
    return new File([blob], filename, { type: mime })
  }
  const handeSelectPhoto = e => {
    let imagesArr = [...images, ...Array.from(e.target.files)]
    if (imagesArr.length > 6) {
      imagesArr.splice(6)
      toast.error('Select too many images')
    }
    setImages(imagesArr)
  }
  const handleOpenFrontCamera = e => {
    setOpenCamera(true)
    navigator.mediaDevices
      ?.getUserMedia({ video: { facingMode: 'user', audio: true } })
      .then(mediaStream =>
        // console.log({mediaStream, a: mediaStream.getVideoTracks()})
        {
          videoRef.current.srcObject = mediaStream
          videoRef.current.play()
          videoRef.current.setAttribute('width', 400)
          videoRef.current.setAttribute(
            'height',
            400 / mediaStream.getVideoTracks()[0].getSettings().aspectRatio
          )
          canvasRef.current.setAttribute('width', 400)
          canvasRef.current.setAttribute(
            'height',
            400 / mediaStream.getVideoTracks()[0].getSettings().aspectRatio
          )
          setTracks(mediaStream.getTracks())
          // videoRef.current.setAttribute(
          // 	'width',
          // 	// mediaStream.getVideoTracks()[0].getSettings().aspectRatio * 400 + 'px'
          // 	'390px'
          // );
          // console.log(videoRef.current);
          // console.log(mediaStream.getVideoTracks()[0].getSettings());
        }
      )
      .catch(err => {
        toast.error(err)
      })
  }
  const handleOpenBackCamera = e => {
    setOpenCamera(true)
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: { exact: 'environment' } } })
      .then(mediaStream =>
        // console.log({mediaStream, a: mediaStream.getVideoTracks()})
        {
          videoRef.current.srcObject = mediaStream
          videoRef.current.play()
          // videoRef.current.style.height = '300px';
          videoRef.current.setAttribute(
            'width',
            // mediaStream.getVideoTracks()[0].getSettings().aspectRatio * 400 + 'px'
            '390px'
          )

          // console.log(videoRef.current);
          // console.log(mediaStream.getVideoTracks()[0].getSettings());
        }
      )
      .catch(err => {
        // console.log(err)
        toast.error(err)
      })
  }
  const captureImage = () => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    context.fillStyle = '#AAA'
    context.drawImage(
      videoRef.current,
      0,
      0,
      videoRef.current.width,
      videoRef.current.height
    )

    const data = canvas.toDataURL('image/png')
    const file = dataURLtoFile(data, 'my_image.png')
    // dataURLtoArrayBuffer()
    let imagesArr = [...images, file]
    if (imagesArr.length > 6) {
      imagesArr.splice(6)
      toast.error('Select too many images')
    }
    setImages(imagesArr)
  }
  useEffect(() => {
    textareRef.current?.focus()
  }, [])

  //update post
  useEffect(() => {
    if (post) {
      textareRef.current.value = post.content
      setImages(post.images)
    }
  }, [post])

  return (
    <div className='status'>
      <div
        onScroll={e => {
          e.preventDefault()
        }}
        className='fixed w-full h-[100vh] top-0 left-0 bg-gray-500 bg-opacity-50 z-[1000] flex items-center justify-center overflow-auto'
      >
        <form className='create-post w-[450px] h-min  max-h-[95vh]  bg-white rounded-md  px-5 py-3 relative'>
          <div className='flex justify-between items-center  pb-2 '>
            <h1 className=' text-[18px] font-[500] select-none'>
              {post ? 'Update Post' : 'Create post'}
            </h1>
            <CloseIcon
              className='cursor-pointer'
              onClick={() => {
                setOnCreatePost(false)
                // setOpenCamera(false);
                // videoRef?.current?.srcObject
                // 	?.getTracks()
                // 	?.forEach((track) => track.stop());
                endStream()
              }}
            />
          </div>
          <hr />
          <textarea
            ref={textareRef}
            name=''
            id=''
            cols='49'
            rows='6'
            className='pt-2 outline-none appearance-none resize-none'
            placeholder={`${user?.fullname} ơi, bạn đang nghĩ gì thế ?`}
            maxLength={200}
          ></textarea>
          <div className='flex justify-end'>
            <EmojiSelect textRef={textareRef} css='right-6' />
          </div>

          {images && (
            <div className='flex pt-2 flex-wrap gap-1'>
              {images.map((image, i) => {
                return (
                  <div
                    key={i}
                    className='h-[100px] w-[130px] border border-blue-300 p-1 relative'
                  >
                    {imgShow(image)}
                    <CloseIcon
                      fontSize='medium'
                      className='absolute top-0 right-0 text-red-400 cursor-pointer z-10'
                      onClick={() => {
                        const copy = [...images]
                        copy.splice(i, 1)
                        setImages(copy)
                      }}
                    />
                  </div>
                )
              })}
            </div>
          )}
          <br />

          {openCamera && (
            <>
              <div className='relative h-min flex justify-center py-2 border border-blue-400 mb-2'>
                <video
                  className={`${theme ? 'invert' : 'invert-0'}`}
                  onCanPlay={e => {
                    // console.log(e.target);
                  }}
                  ref={videoRef}
                  src=''
                ></video>
                <CloseIcon
                  fontSize='large'
                  className='absolute top-2 right-2  text-red-400 cursor-pointer'
                  onClick={() => {
                    // setOpenCamera(false);
                    // console.log(videoRef.current.srcObject);
                    // videoRef?.current?.srcObject
                    // 	?.getTracks()
                    // 	?.forEach((track) => track.stop());
                    endStream()
                  }}
                />
                <ChangeCircleIcon
                  fontSize='large'
                  className='absolute bottom-3 right-3 text-red-400 cursor-pointer'
                  onClick={handleOpenBackCamera}
                />
                <canvas className=' hidden ' ref={canvasRef}></canvas>
              </div>
            </>
          )}
          {openCamera ? (
            <div className='flex justify-center gap-3 '>
              <AddAPhotoIcon
                sx={{ fontSize: '32px' }}
                className='cursor-pointer'
                onClick={captureImage}
              />
            </div>
          ) : (
            <div className='flex justify-center gap-3'>
              <AddAPhotoIcon
                sx={{ fontSize: '32px' }}
                className='cursor-pointer'
                onClick={handleOpenFrontCamera}
              />
              <label htmlFor='select-photo'>
                <AddPhotoAlternateIcon
                  fontSize='large'
                  className='cursor-pointer'
                />
                <input
                  className='hidden'
                  type='file'
                  id='select-photo'
                  multiple
                  onChange={handeSelectPhoto}
                  accept='image/*, video/*'
                />
              </label>
            </div>
          )}
          <Button
            type='dashed'
            className='w-full !my-[10px] !font-[400]'
            onClick={handleCreatePost}
          >
            {post ? 'Update' : 'Post'}
          </Button>
        </form>
      </div>
    </div>
  )
}
export default CreatePost
