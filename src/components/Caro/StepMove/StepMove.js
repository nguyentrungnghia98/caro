/* eslint-disable react/no-deprecated */
/* eslint-disable react/prop-types */
/* eslint-disable no-return-assign */
import React from 'react';

const StepMove = props => {
  const {
    history,
    isIncrease,
    moveStepLocation,
    moveStep,
    moveToStep,
    opponent
  } = props;
  const { length } = history;
  return history.map((val, move) => {
    const step = isIncrease ? move : length - move - 1;
    const location = moveStepLocation[step];

    const player = move % 2 === 0 ? opponent : 'Player';
    const desc = step
      ? `${player} #${step}\n(${location})`
      : 'Go to game start';
    return (
      <li key={`step${step}`}>
        <button
          type="button"
          className={`btn btn-step ${step === moveStep ? 'current' : ''}`}
          onClick={() => moveToStep(step)}
        >
          {desc}
        </button>
      </li>
    );
  });
};

export default StepMove;
