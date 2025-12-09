import React from 'react';

const Cross = ({
  height = 24,
  width = 24,
  fill = '#252629',
  ...others
}) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill='none' xmlns='http://www.w3.org/2000/svg' style={{ cursor: 'pointer' }} {...others}>
    <path fillRule='evenodd' clipRule='evenodd' d='M13.414 12L19.071 6.34297C19.462 5.95297 19.462 5.31997 19.071 4.92897C18.681 4.53897 18.048 4.53897 17.657 4.92897L12 10.586L6.34299 4.92897C5.95199 4.53897 5.31899 4.53897 4.92899 4.92897C4.53799 5.31997 4.53799 5.95297 4.92899 6.34297L10.586 12L4.92899 17.657C4.53799 18.047 4.53799 18.68 4.92899 19.071C5.12399 19.266 5.37999 19.364 5.63599 19.364C5.89199 19.364 6.14699 19.266 6.34299 19.071L12 13.414L17.657 19.071C17.852 19.266 18.108 19.364 18.364 19.364C18.62 19.364 18.876 19.266 19.071 19.071C19.462 18.68 19.462 18.047 19.071 17.657L13.414 12Z' fill={fill} />
  </svg>

);

export default Cross;
