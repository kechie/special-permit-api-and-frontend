// src/components/CarouselImage.jsx
import React from 'react'
import PropTypes from 'prop-types'
import { Image } from 'react-bootstrap'

const CarouselImage = ({ text }) => {
  return (
    <div className="d-flex justify-content-center bg-dark">
      <Image
        src={`https://via.placeholder.com/800x400?text=${encodeURIComponent(text)}`}
        alt={text}
        fluid
      />
    </div>
  )
}

CarouselImage.propTypes = {
  text: PropTypes.string.isRequired,
}

export default CarouselImage
