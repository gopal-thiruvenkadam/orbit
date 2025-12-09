import React from 'react';

const Email = ({
  height = 24,
  width = 24,
  fill = '#1C1C1F',
}) => (
  <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill='none' xmlns='http://www.w3.org/2000/svg'>
    <path fillRule='evenodd' clipRule='evenodd' d='M5 18V7.414L11.293 13.707C11.488 13.902 11.744 14 12 14C12.256 14 12.512 13.902 12.707 13.707L19 7.414V18H5ZM12 11.586L6.414 6H17.586L12 11.586ZM20.923 4.618C20.821 4.374 20.626 4.179 20.382 4.077C20.26 4.026 20.13 4 20 4H4C3.87 4 3.74 4.026 3.618 4.077C3.374 4.179 3.179 4.374 3.077 4.618C3.027 4.74 3 4.87 3 5V19C3 19.552 3.448 20 4 20H20C20.552 20 21 19.552 21 19V5C21 4.87 20.974 4.74 20.923 4.618Z' fill={fill} />
  </svg>
);

export default Email;
