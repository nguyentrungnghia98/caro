/* eslint-disable react/no-deprecated */
/* eslint-disable react/prop-types */
/* eslint-disable no-return-assign */
import React from 'react';
import StepMoveContainer from '../StepMove/StepMoveContainer';

class Step extends React.Component {
  constructor(props) {
    super(props);
    this.stepMove = React.createRef();
  }

  scrollToBottom() {
    this.stepMove.scrollTop =
      this.stepMove.scrollHeight - this.stepMove.clientHeight;
  }

  scrollToTop() {
    this.stepMove.scrollTop = 0;
  }

  render() {
    const { changeOrderStep, isIncrease } = this.props;
    return (
      <div className="step-move-container">
        <div className="step__header flex-space">
          <div className="history">History</div>
          <button
            type="button"
            className="btn btn__change-order"
            onClick={changeOrderStep}
          >
            {isIncrease ? (
              <i className="fas fa-sort-amount-down-alt"></i>
            ) : (
              <i className="fas fa-sort-amount-up"></i>
            )}
          </button>
        </div>

        <ul className="step-move" ref={ref => (this.stepMove = ref)}>
          <StepMoveContainer />
        </ul>
      </div>
    );
  }
}

export default Step;
