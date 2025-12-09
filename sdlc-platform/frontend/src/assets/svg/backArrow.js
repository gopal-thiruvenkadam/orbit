/* eslint-disable react/forbid-prop-types */
import React from 'react';

const CaretRight = ({
  height = 24,
  width = 24,
  fill = '#252629',
  style = {},
}) => (
  <svg width={width} height={height} style={{ ...style, cursor: 'pointer' }} viewBox={`0 0 ${width} ${height}`} fill='none' xmlns='http://www.w3.org/2000/svg'>
    <path fillRule='evenodd' clipRule='evenodd' d='M17.9997 11H8.41373L10.7067 8.70701C11.0977 8.31601 11.0977 7.68401 10.7067 7.29301C10.3157 6.90201 9.68373 6.90201 9.29273 7.29301L5.29273 11.292C5.20073 11.385 5.12773 11.496 5.07673 11.618C4.97573 11.862 4.97573 12.138 5.07673 12.382C5.12773 12.504 5.20073 12.615 5.29273 12.708L9.29273 16.707C9.48773 16.902 9.74373 17 9.99973 17C10.2557 17 10.5117 16.902 10.7067 16.707C11.0977 16.316 11.0977 15.684 10.7067 15.293L8.41373 13H17.9997C18.5517 13 18.9997 12.552 18.9997 12C18.9997 11.448 18.5517 11 17.9997 11Z' fill={fill} />
  </svg>
);

export default CaretRight;
