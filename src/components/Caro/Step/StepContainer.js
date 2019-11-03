import { connect } from 'react-redux';
import Step from '../Step/Step';
import { changeOrderStep } from '../../../actions/caro';

const mapStateToProp = state => {
  const { isIncrease } = state.step;
  return {
    isIncrease
  };
};

export default connect(
  mapStateToProp,
  {
    changeOrderStep
  },
  null,
  { forwardRef: true }
)(Step);
