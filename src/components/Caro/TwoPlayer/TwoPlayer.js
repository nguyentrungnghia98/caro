/* eslint-disable react/no-deprecated */
/* eslint-disable react/prop-types */
/* eslint-disable no-return-assign */
import React from 'react';
import shortid from 'shortid';
import socketIOClient from 'socket.io-client';
import WinnerPopUp from '../PopUp/WinnerPopUp';
import Topbar from '../../Topbar/Topbar';
import Square from '../Square/Square';
import './TwoPlayer.scss';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Link } from 'react-router-dom';

class TwoPlayer extends React.Component {
  constructor() {
    super();
    this.length = 20;
    this.size = new Array(this.length).fill(0);
    this.state = {
      connected: false,
      symbol: null,
      turn: false,
      hasOpponentLeft: false,
      isPendingUndo: false,
      isPendingDraw: false,
      isPendingRestart: false,
      isDraw: false,
      lastStep: 0,
      messages: [],
      message: ''
    };
    this.socket = socketIOClient('http://localhost:3001');
    this.step = 0;
  }

  onUserWin(squares, winner) {
    console.log('onUserWin was called');
    const { updateWinnerUI } = this.props;
    updateWinnerUI(squares, winner);
  }

  checkWinner(row, column, oldSquares) {
    const squares = JSON.parse(JSON.stringify(oldSquares));
    const currentSelect = this.state.symbol;
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
          return winnerSquares1;
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
          return winnerSquares2;
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
            return winnerSquares1;
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
            return winnerSquares2;
          }
        }
      }
    }
    return false;
  }

  componentDidMount() {
    const { restartCaro, openAlertQuestion } = this.props;
    restartCaro();

    this.socket.on('game.begin', data => {
      console.log(data);
      this.setState({
        connected: true,
        symbol: data.symbol,
        turn: data.symbol === 'X'
      });
    });

    this.socket.on('opponent.left', () => {
      console.log('Opponent was left');
      this.props.openAlertError('End game', 'Your opponent has left the match');
      this.setState({
        hasOpponentLeft: true,
        turn: false
      });
    });

    // on user click sqaure
    this.socket.on('move.made', data => {
      console.log('move.made', data);
      const { i, j } = data.position;
      const { history, moveStep, clickSquare } = this.props;
      const { squares } = history[moveStep];

      clickSquare(i, j, data.symbol);
      //this.checkWinner(i, j, squares);
      if (data.symbol !== this.state.symbol) this.setState({ turn: true });
    });

    // on user win
    this.socket.on('game.winner', data => {
      console.log('game.winner');
      this.setState({ turn: false });
      this.onUserWin(data.winnerSquares, data.symbol);
      const { openLoserModal, openWinnerModal } = this.props;
      if (data.symbol === this.state.symbol) {
        openWinnerModal();
      } else {
        openLoserModal();
      }
    });

    // on accept undo request
    this.socket.on('question.undo', step => {
      this.step = step;
      console.log('question step', this.step);
      openAlertQuestion(
        'Request Undo',
        'Let your opponent undo their last move?',
        'Ok',
        this.onAcceptUndo
      );
    });
    // process undo
    this.socket.on('game.undo', step => {
      console.log('Process undo', step);
      this.props.moveToStep(step);
      this.setState({
        isPendingUndo: false
      });
    });

    // on accept draw
    this.socket.on('question.draw', () => {
      console.log('question draw');
      openAlertQuestion(
        'Request Draw',
        'Accept a draw?',
        'Ok',
        this.onAcceptDraw
      );
    });
    // process draw
    this.socket.on('game.draw', () => {
      console.log('Process draw');
      this.setState({
        isPendingDraw: false,
        isDraw: true
      });
    });

    // on accept restart
    this.socket.on('question.restart', () => {
      console.log('question restart');
      openAlertQuestion(
        'Request Restart',
        'Accept restart game?',
        'Ok',
        this.onAcceptRestart
      );
    });
    // process restart
    this.socket.on('game.restart', () => {
      console.log('Process restart');
      this.onRestart();
      this.setState({
        isPendingRestart: false
      });
    });

    // receive message
    this.socket.on('message.receive', data => {
      console.log('message.receive', data);
      const { messages } = this.state;
      this.setState({
        messages: [...messages, data]
      });
    });
  }

  componentWillUnmount() {
    this.socket.close();
  }

  sendMessage = e => {
    e.preventDefault();
    this.socket.emit('message.send', {
      createdAt: new Date(),
      from: this.state.symbol,
      message: this.state.message
    });
    this.setState({ message: '' });
  };

  onAcceptUndo = () => {
    console.log('Accept UNDO');
    this.socket.emit('accept.undo', this.step);
  };

  requestUndo = () => {
    this.setState({
      isPendingUndo: true
    });
    this.socket.emit('request.undo', this.state.lastStep);
  };

  onAcceptDraw = () => {
    console.log('Accept Draw');
    this.socket.emit('accept.draw');
  };

  requestDraw = () => {
    this.setState({
      isPendingDraw: true
    });
    this.socket.emit('request.draw');
  };

  onAcceptRestart = () => {
    console.log('Accept restart');
    this.socket.emit('accept.restart');
  };

  requestRestart = () => {
    this.props.closeWinnerModal();
    this.setState({
      isPendingRestart: true
    });
    this.socket.emit('request.restart');
  };

  onRestart = () => {
    const { restartCaro, closeWinnerModal } = this.props;
    const turn = this.state.symbol === 'X' ? true : false;
    closeWinnerModal();
    restartCaro();
    this.setState({
      hasOpponentLeft: false,
      isPendingUndo: false,
      isPendingDraw: false,
      isPendingRestart: false,
      isDraw: false,
      lastStep: 0,
      turn
    });
  };

  handleClick(i, j) {
    const { history, moveStep } = this.props;
    const { squares } = history[moveStep];

    if (squares[i][j] !== 0) {
      return;
    }

    this.setState({
      turn: false,
      lastStep: moveStep
    });

    this.socket.emit('make.move', {
      symbol: this.state.symbol,
      position: {
        i,
        j
      }
    });

    const winnerSquares = this.checkWinner(i, j, squares);
    if (winnerSquares) {
      this.socket.emit('game.win', {
        symbol: this.state.symbol,
        winnerSquares
      });
    }
  }

  renderRow(squares, i) {
    const { isWinner, winnerSquares } = this.props;
    const { turn } = this.state;
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
          disabled={isWinner || !turn}
        />
      );
    });
  }

  renderHeader() {
    const { turn, symbol, hasOpponentLeft, isDraw } = this.state;
    const { winner, isWinner } = this.props;
    const isYouWin = symbol === winner;
    if (isDraw) {
      return (
        <div className="turn-box">
          <div className="small">Result: </div>
          <div className="current-turn jump-animation win">Draw</div>
        </div>
      );
    }
    if (isWinner) {
      return (
        <div className="turn-box">
          <div className="small">Result: </div>
          <div
            className={
              'current-turn jump-animation ' + (isYouWin ? 'win' : 'lose')
            }
          >
            {isYouWin ? 'You win' : 'You lose'}
          </div>
        </div>
      );
    } else {
      if (hasOpponentLeft) {
        return (
          <div className="turn-box">
            <div className="current-turn jump-animation left">
              Opponent has left game
            </div>
          </div>
        );
      }
      return (
        <div className="turn-box">
          <div className="small">Turn: </div>
          <div className={'current-turn ' + (turn ? 'jump-animation' : '')}>
            {turn ? 'Your turn' : 'Opponent turn'}
          </div>
        </div>
      );
    }
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
    const { history, moveStep, isWinner } = this.props;
    const { squares } = history[moveStep];
    const {
      connected,
      isPendingUndo,
      isPendingDraw,
      messages,
      symbol,
      message,
      isDraw,
      isPendingRestart,
      hasOpponentLeft
    } = this.state;
    return (
      <>
        <Topbar />
        <div className="container caro-container two-player">
          {connected ? (
            <>
              {/* {this.renderLeftSide()} */}
              <div className="board">
                <WinnerPopUp onRestart={this.requestRestart} />
                {this.renderBoard(squares)}
              </div>
              {/* {this.renderRightSide()} */}
              <div className="right-side">
                <div className="side__header">
                  <h5>2 PLAYER</h5>
                  {this.renderHeader()}
                  <button
                    className="btn btn-restart"
                    onClick={this.requestRestart}
                    disabled={isPendingRestart || hasOpponentLeft}
                  >
                    {isPendingRestart ? (
                      <CircularProgress size={20} />
                    ) : (
                      'Restart'
                    )}
                  </button>
                </div>
                <div className="chat-box">
                  <div className="chat-box__header">Chat</div>
                  <div className="chat-box__body">
                    <div className="message-box">
                      {messages.map(({ from, message, createdAt }, i) => {
                        const date = new Date(createdAt);
                        const time = date.getHours() + ':' + date.getMinutes();
                        return (
                          <div className="message__content" key={i}>
                            <div className="from">
                              {from === symbol ? 'You' : 'Opponent'}:{' '}
                              <span className="created-at">{time}</span>
                            </div>
                            <div className="content">{message}</div>
                          </div>
                        );
                      })}
                    </div>

                    <form className="send-message" onSubmit={this.sendMessage}>
                      <input
                        className="content-message"
                        placeholder="Message"
                        value={message}
                        required
                        onChange={el =>
                          this.setState({ message: el.target.value })
                        }
                      />
                      <button className="btn btn__send" disabled={!message}>
                        Send
                      </button>
                    </form>
                  </div>
                </div>
                <div className="flex-end">
                  <Link to="/caro">
                    <button type="button" className="btn">
                      Quit
                    </button>
                  </Link>
                  <button
                    type="button"
                    className="btn"
                    onClick={this.requestDraw}
                    disabled={isPendingDraw || isWinner || isDraw}
                  >
                    {isPendingDraw ? <CircularProgress size={20} /> : 'Draw'}
                  </button>
                  <button
                    type="button"
                    className="btn btn-restart"
                    onClick={this.requestUndo}
                    disabled={isPendingUndo || isWinner || isDraw}
                  >
                    {isPendingUndo ? <CircularProgress size={20} /> : 'Undo'}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="board">
              <div className="waiting-opponent">
                <div className="loader">
                  <div className="text">Waiting for opponent to join</div>
                  <div className="dots">
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </>
    );
  }
}

export default TwoPlayer;
