import React from 'react'
import Button from '@mui/material/Button'
import Lottie from 'react-lottie'
import * as animationData from '../animation/animation_ll70lfkr.json'

const LoadMoreBtn = ({ handleLoadMore, loading, page, totalPage }) => {
  return loading ? (
    <Lottie width={50} height={50} options={{ animationData }}></Lottie>
  ) : page - 1 < totalPage ? (
    <Button
      variant='text'
      className='!my-2 !mx-auto !lowercase'
      onClick={handleLoadMore}
    >
      Load more...
    </Button>
  ) : (
    ''
  )
}

export default LoadMoreBtn
