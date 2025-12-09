/* eslint-disable react/forbid-prop-types */
import React from 'react';

const CaretRight = ({
  height = 24,
  width = 24,
  fill = '#252629',
  style = {},
}) => (
  <svg width={width} height={height} style={{ ...style, cursor: 'pointer' }} viewBox={`0 0 ${width} ${height}`} fill='none' xmlns='http://www.w3.org/2000/svg'>
    <path fillRule='evenodd' clipRule='evenodd' d='M15.7073 11.293L11.7072 7.29301C11.3162 6.90201 10.6842 6.90201 10.2932 7.29301C9.90225 7.68401 9.90225 8.31601 10.2932 8.70701L13.5863 12L10.2932 15.293C9.90225 15.684 9.90225 16.316 10.2932 16.707C10.4882 16.902 10.7442 17 11.0002 17C11.2563 17 11.5122 16.902 11.7072 16.707L15.7073 12.707C16.0982 12.316 16.0982 11.684 15.7073 11.293Z' fill={fill} />
  </svg>
);

export default CaretRight;
