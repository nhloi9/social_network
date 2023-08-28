import React, { useState } from 'react'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { useSelector } from 'react-redux'

const CardBody = ({ post }) => {
  const settings = {
    // dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000 + Math.random() * 1000
  }
  const { theme } = useSelector(state => state)
  // const imgRef = useRef(null)

  const [readMore, setReadMore] = useState(false)

  // useEffect(() => {
  //   window.addEventListener('resize', updateHeight)
  //   updateHeight()
  //   return () => {
  //     window.removeEventListener('resize', updateHeight)
  //   }
  // }, [])
  // const updateHeight = () => {
  //   // imgRef.current?.style?.height = (imgRef.current.offsetWidth * 2) / 3.0 + 'px'
  // }
  // console.log(settings.autoplaySpeed)
  return (
    <div className='px-4 card_body'>
      {post.content && (
        <div>
          {post.content.length < 60 ? (
            <p>{post.content}</p>
          ) : (
            <div>
              {readMore ? (
                <p>
                  {post.content}

                  <span
                    className='ml-2 text-red-400 cursor-pointer'
                    onClick={() => {
                      setReadMore(false)
                    }}
                  >
                    hidden
                  </span>
                </p>
              ) : (
                <p>
                  {post.content.slice(0, 60)}
                  <span
                    onClick={() => setReadMore(true)}
                    className='ml-1 text-red-400 cursor-pointer'
                  >
                    ...read more
                  </span>
                </p>
              )}
            </div>
          )}
        </div>
      )}
      <div className='w-full  border my-2  p-2'>
        <Slider {...settings}>
          {post.images?.map((image, index) => {
            if (image.url.match(/video/))
              return (
                <video
                  controls
                  key={index}
                  alt=''
                  src={image.url}
                  className={` w-full h-[150px] 400px:h-[300px] 800px:h-[400px] block object-contain ${
                    theme ? 'invert' : ''
                  }`}
                />
              )
            else
              return (
                <img
                  key={index}
                  alt=''
                  src={image.url}
                  className={` w-full h-[150px] 400px:h-[300px] 800px:h-[400px] block object-contain ${
                    theme ? 'invert' : ''
                  }`}
                />
              )
          })}
        </Slider>
      </div>
    </div>
  )
}

export default CardBody
