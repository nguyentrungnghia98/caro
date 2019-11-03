/* eslint-disable react/no-deprecated */
/* eslint-disable react/prop-types */
/* eslint-disable no-return-assign */
import React from 'react';
import shortid from 'shortid';
import Square from '../Square/Square';
import WinnerPopUp from '../PopUp/WinnerPopUp';
import StepContainer from '../Step/StepContainer';
import '../Caro.scss';
import './OnePlayer.scss';
import Topbar from '../../Topbar/Topbar';

class OnePlayer extends React.Component {
  constructor(props) {
    super(props);
    this.length = 20;
    this.size = new Array(this.length).fill(0);
    this.stepMoveEl = React.createRef();
    this.pendingGenerateNextCaro = false;
    this.turn = true;
  }

  componentWillMount() {
    this.stepMoveEl = {};
    this.onRestart();
  }

  onRestart = () => {
    console.log('onRestart');
    const { restartCaro } = this.props;
    this.pendingGenerateNextCaro = false;
    restartCaro();
  };

  onChangeTurn() {
    const { changeTurn } = this.props;
    changeTurn();
  }

  onUserWin(squares) {
    console.log('onUserWin was called');
    const { updateWinnerUI } = this.props;
    updateWinnerUI(squares);
  }

  checkWinner(row, column, oldSquares, isSecondCheck = false) {
    const squares = JSON.parse(JSON.stringify(oldSquares));
    const { turn } = this.props;

    const currentTurn = isSecondCheck ? !turn : turn;
    const currentSelect = currentTurn ? 'X' : 'O';
    squares[row][column] = currentSelect;

    let countRow = 0;
    let countColumn = 0;
    const inverseSelect = currentSelect === 'X' ? 'O' : 'X';
    let winnerSquares1 = [];
    let winnerSquares2 = [];
    console.log('turn', currentTurn);
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
          return true;
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
          return true;
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
            return true;
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
            return true;
          }
        }
      }
    }
    this.onChangeTurn();
    return false;
  }

  generateNextQuare(i, j, squares) {
    let newI, newJ;
    // check square nest current select
    let count = 20;
    do {
      newI = i + Math.floor(Math.random() * 4 - 2);
      newJ = j + Math.floor(Math.random() * 4 - 2);
      count--;
    } while (count > 0 && (!squares[newI] || squares[newI][newJ] !== 0));

    if (newI !== i && newJ !== j && squares[newI] && squares[newI][newJ] === 0)
      return [newI, newJ];

    // if not check all square
    do {
      newI = Math.floor(Math.random() * 20);
      newJ = Math.floor(Math.random() * 20);
    } while ((newI === i && newJ === j) || squares[newI][newJ] !== 0);

    return [newI, newJ];
  }

  handleClick(i, j) {
    const {
      history,
      moveStep,
      clickSquare,
      isIncrease,
      openLoserModal,
      openWinnerModal
    } = this.props;
    const { squares } = history[moveStep];

    if (squares[i][j] !== 0) {
      return;
    }
    if (this.pendingGenerateNextCaro) return;
    this.pendingGenerateNextCaro = true;
    let isWinner = false;
    if (moveStep % 2 !== 0) {
      //computer turn
      const [nextI, nextJ] = this.generateNextQuare(-1, -1, squares);
      clickSquare(nextI, nextJ);
      isWinner = this.checkWinner(nextI, nextJ, squares);
      if (isWinner) return openLoserModal();
    } else {
      //select current square
      clickSquare(i, j);
      isWinner = this.checkWinner(i, j, squares);
      //generate next square
      if (!isWinner) {
        const [nextI, nextJ] = this.generateNextQuare(i, j, squares);
        clickSquare(nextI, nextJ);
        isWinner = this.checkWinner(nextI, nextJ, squares, true);
        if (isWinner) return openLoserModal();
      } else {
        return openWinnerModal();
      }
    }

    if (history.length === 20 * 20 - 1 && !isWinner) {
      return openLoserModal();
    }

    this.pendingGenerateNextCaro = false;
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

  render() {
    console.log('props', this.props);
    const { history, moveStep } = this.props;
    const { squares } = history[moveStep];

    return (
      <>
        <Topbar />
        <div className="container caro-container one-player">
          <div className="board">
            <WinnerPopUp onRestart={this.onRestart} />
            {this.renderBoard(squares)}
          </div>

          <div className="right-side">
            <div className="side__header">
              <h5>Play with Computer</h5>
              <div className="flex-space">
                <div>Player (X)</div>
                <div>Computer (O)</div>
              </div>
            </div>
            <StepContainer ref={ref => (this.stepMoveEl = ref)} />
            <div className="flex-end">
              <button
                type="button"
                className="btn btn-restart"
                onClick={this.onRestart}
              >
                Restart
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default OnePlayer;
