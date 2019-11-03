/* eslint-disable react/no-deprecated */
/* eslint-disable react/prop-types */
/* eslint-disable no-return-assign */
import React from 'react';
import TimeIcon from '../../../assets/images/times-icon.png';
import CircleIcon from '../../../assets/images/circle-icon.png';

const Square = props => {
  const { value, isHighLight, onClick, disabled } = props;
  let img = null;
  if (value) {
    img = value === 'X' ? TimeIcon : CircleIcon;
  }
  return (
    <button
      type="button"
      className={`square ${isHighLight ? 'highlight' : ''}`}
      onClick={onClick}
      disabled={disabled}
    >
      {img && (
        <div className="image-container">
          <img alt="" src={img} />
        </div>
      )}
    </button>
  );
};

export default Square;
