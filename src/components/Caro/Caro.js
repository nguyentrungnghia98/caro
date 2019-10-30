/* eslint-disable react/no-deprecated */
/* eslint-disable react/prop-types */
/* eslint-disable no-return-assign */
import React from 'react';
import shortid from 'shortid';
import Square from './Square/Square';
import WinnerPopUp from './PopUp/WinnerPopUp';
import StepContainer from './Step/StepContainer';
import './Caro.scss';

class Caro extends React.Component {
  constructor(props) {
    super(props);
    this.length = 20;
    this.size = new Array(this.length).fill(0);
    this.stepMoveEl = React.createRef();
  }

  componentWillMount() {
    this.stepMoveEl = {};
  }

  onRestart = () => {
    const { restartCaro } = this.props;
    restartCaro();
  };

  onChangeTurn() {
    const { changeTurn } = this.props;
    changeTurn();
  }

  onUserWin(squares) {
    console.log('onUserWin was called');
    const { updateWinnerUI, openWinnerModal } = this.props;
    updateWinnerUI(squares);
    openWinnerModal();
  }

  checkWinner(row, column, oldSquares) {
    const squares = JSON.parse(JSON.stringify(oldSquares));
    const { turn } = this.props;
    const currentSelect = turn ? 'X' : 'O';
    squares[row][column] = currentSelect;

    let countRow = 0;
    let countColumn = 0;
    const inverseSelect = currentSelect === 'X' ? 'O' : 'X';
    let winnerSquares1 = [];
    let winnerSquares2 = [];
    // check current Row and Column
    for (let i = 0; i < this.length; i += 1) {
      if (squares[row][i] === currentSelect) {
        countRow += 1;
        winnerSquares1.push({ i: row, j: i });
      } else {
        countRow = 0;
        winnerSquares1 = [];
      }
      if (countRow === 5) {
        if (
          squares[row][i + 1] === inverseSelect &&
          squares[row][i - 5] === inverseSelect
        ) {
          countRow = 0;
        } else {
          this.onUserWin(winnerSquares1);
          return;
        }
      }

      if (squares[i][column] === currentSelect) {
        countColumn += 1;
        winnerSquares2.push({ i, j: column });
      } else {
        countColumn = 0;
        winnerSquares2 = [];
      }
      if (countColumn === 5) {
        if (
          squares[i + 1][column] === inverseSelect &&
          squares[i - 5][column] === inverseSelect
        ) {
          countColumn = 0;
        } else {
          this.onUserWin(winnerSquares2);
          return;
        }
      }
    }
    // check diagonal right and left
    let countRight = 0;
    let countLeft = 0;
    winnerSquares1 = [];
    winnerSquares2 = [];
    const l = Math.ceil(Math.sqrt(2) * this.length);
    for (let i = 0; i <= l; i += 1) {
      const rRow = this.length - 1 - i;
      const rColumn = column - (this.length - row - 1) + i;
      if (squares[rRow] !== undefined && squares[rRow][rColumn] !== undefined) {
        if (squares[rRow][rColumn] === currentSelect) {
          countRight += 1;
          winnerSquares1.push({ i: rRow, j: rColumn });
        } else {
          countRight = 0;
          winnerSquares1 = [];
        }
        if (countRight === 5) {
          if (
            squares[rRow - 1][rColumn + 1] === inverseSelect &&
            squares[rRow + 5][rColumn - 5] === inverseSelect
          ) {
            countRight = 0;
          } else {
            this.onUserWin(winnerSquares1);
            return;
          }
        }
      }
      // diagonal left
      const lRow = i;
      const lColumn = column - row + i;
      if (squares[lRow] !== undefined && squares[lRow][lColumn] !== undefined) {
        if (squares[lRow][lColumn] === currentSelect) {
          countLeft += 1;
          winnerSquares2.push({ i: lRow, j: lColumn });
        } else {
          countLeft = 0;
          winnerSquares2 = [];
        }
        if (countLeft === 5) {
          if (
            squares[lRow + 1][lColumn + 1] === inverseSelect &&
            squares[lRow - 5][lColumn - 5] === inverseSelect
          ) {
            countLeft = 0;
          } else {
            this.onUserWin(winnerSquares2);
            return;
          }
        }
      }
    }
    this.onChangeTurn();
  }

  handleClick(i, j) {
    const { history, moveStep, clickSquare, isIncrease } = this.props;
    const { squares } = history[moveStep];

    if (squares[i][j] !== 0) {
      return;
    }

    clickSquare(i, j);
    this.checkWinner(i, j, squares);

    console.log('ref', this.stepMoveEl);
    setTimeout(() => {
      if (isIncrease) {
        this.stepMoveEl.scrollToBottom();
      } else {
        this.stepMoveEl.scrollToTop();
      }
    }, 300);
  }

  renderRow(squares, i) {
    const { isWinner, winnerSquares } = this.props;
    return this.size.map((el, j) => {
      const value = squares[i][j] ? squares[i][j] : null;
      let isHighLight = false;
      if (isWinner) {
        isHighLight = winnerSquares.some(loc => loc.i === i && loc.j === j);
      }
      return (
        <Square
          isHighLight={isHighLight}
          value={value}
          onClick={() => this.handleClick(i, j)}
          key={`square-${shortid.generate()}`}
          disabled={isWinner}
        />
      );
    });
  }

  renderBoard(squares) {
    return this.size.map((el, i) => {
      return (
        <div className="board--row" key={`row-${shortid.generate()}`}>
          {this.renderRow(squares, i)}
        </div>
      );
    });
  }

  renderLeftSide(winner) {
    const { turn, isWinner } = this.props;
    return (
      <div className="turn turn-left">
        {turn && (
          <h2 className="turn-animation">
            {winner === 'X' && isWinner ? 'You win' : 'Your turn'}
          </h2>
        )}
        <div className="symbol">X</div>
      </div>
    );
  }

  renderRightSide(winner) {
    const { turn, isWinner } = this.props;
    return (
      <div className="turn turn-right">
        {!turn && (
          <h2 className="turn-animation">
            {winner === 'O' && isWinner ? 'You win' : 'Your turn'}
          </h2>
        )}
        <div className="symbol">O</div>
      </div>
    );
  }

  render() {
    console.log('props', this.props);
    const { turn, history, moveStep } = this.props;
    const winner = turn ? 'X' : 'O';
    const { squares } = history[moveStep];

    return (
      <div className="container caro-container">
        {this.renderLeftSide(winner)}
        <div className="board">
          <WinnerPopUp />
          {this.renderBoard(squares)}
        </div>
        {this.renderRightSide(winner)}

        <button
          type="button"
          className="btn btn-restart custom-location"
          onClick={this.onRestart}
        >
          Restart
        </button>

        <StepContainer ref={ref => (this.stepMoveEl = ref)} />
      </div>
    );
  }
}

export default Caro;
