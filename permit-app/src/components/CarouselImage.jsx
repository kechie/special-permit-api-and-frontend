// src/components/CarouselImage.jsx
import React from 'react'
import { Image } from 'react-bootstrap'

const CarouselImage = ({ text }) => {
  return (
    <div className="d-flex justify-content-center align-items-center bg-dark" style={{ height: '400px' }}>
      <Image
        src={`https://via.placeholder.com/800x400?text=${encodeURIComponent(text)}`}
        alt={text}
        fluid
      />
    </div>
  )
}

export default CarouselImage