import React from 'react';
import Square from './Square.jsx';
import './index.css';


class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      numPlayers: props.numPlayers,
      playerNames: props.playerNames,
      history: [{
        squares: Array(7*props.numPlayers).fill(null),
        scores: Array(props.numPlayers).fill(0),
        closedAll: Array(props.numPlayers).fill(false),
      }],
    };
  }

  handleClick(i) {
    const history = this.state.history;
    const current = history[history.length - 1];
    const numPlayers = this.state.numPlayers;
    let squares = current.squares.slice();
    let scores = current.scores.slice();
    let closedAll = current.closedAll.slice();

    if (declareWinner(closedAll, scores, numPlayers) === "") {
      if (squares[i] === null) {
        squares[i] = "/";
      }
      else if (squares[i] === "/") {
        squares[i] = "X";
      }
      else if (squares[i] === "X") {
        squares[i] = "Ⓧ";
      }
      else {
        scores = getScores(scores, squares, i, numPlayers);
      }
    }

    closedAll[i % numPlayers] = didCloseAll(squares, i, numPlayers);

    this.setState(
      {
        history: history.concat({
          squares: squares,
          scores: scores,
          closedAll: closedAll,
        }),
      }
    );
  }

  undo() {
    const history = this.state.history;

    this.setState({
      history: history.slice(0, history.length - 1),
    });
  }

  renderUndoButton() {
    if (this.state.history.length > 1) {
      return (
        <button onClick={() => this.undo()}>
          Undo last step
        </button>
      );
    }
    else {
      return <p></p>;
    }
  }

  newGame() {
    let newGame = window.confirm("Are you sure you want to start a new game?  "
      + "Your progress will not be saved.");
    if (newGame) {
      window.location.reload()
    }
  }

  renderNewGameButton() {
    return (
      <button onClick={() => this.newGame()}>
        Start new game
      </button>
    );
  }

  renderSquare(i) {
    const history = this.state.history;  // think i need 2 lift this up...
    const current = history[history.length - 1];
    const squares = current.squares;

    return (
      <Square 
        value={squares[i]}
        onClick={() => this.handleClick(i)}
      />
    );
  }

  render() {
    const numPlayers = this.state.numPlayers;
    const history = this.state.history;  // think i need 2 lift this up...
    const current = history[history.length - 1];
    const myScores = current.scores;
    const closedAll = current.closedAll;

    // Generate team names
    /*let teamNames = [];
    for (let i = 1; i <= numPlayers; i++) {
      teamNames.push(<div className="score">Player {i}</div>);
    }*/

    let teamNames = [];
    for (let i = 0; i < numPlayers; i++) {
      teamNames.push(<div className="score">{this.state.playerNames[i]}</div>);
    }

    // Generate board
    let board = [];

    for (let i = 0; i < 7; i++) {
      let row = [];

      for (let j = 0; j < numPlayers; j++) {
        row.push(this.renderSquare(numPlayers*i + j));
      }

      let rowTag = 20 - i;
      if (rowTag === 14) {
        rowTag = "B";
      }

      board.push(<div className="board-row">{row} &emsp; {rowTag}</div>);
    }

    // Generate scores
    let scores = [];
    for (let i = 0; i < numPlayers; i++) {
      scores.push(<div className="score">{myScores[i]}</div>)
    }

    // Undo button
    const undoButton = this.renderUndoButton();

    // Determine winner
    const winner = (
      <div className="status">
        {declareWinner(closedAll, myScores, numPlayers)}
      </div>
    );

    // New game button
    const newGameButton = this.renderNewGameButton();

    return(
      <div>
        <div>{teamNames}</div>
        <div>{board}</div>
        <div>{scores}</div>
        <div>{winner}</div>
        <div>{undoButton}</div>
        <div>{newGameButton}</div>
      </div>
    );
  }
}

export default Board;

// ========================================

function getScores(scores, squares, i, numPlayers) {
  if (numPlayers === 2) {
    return getScoresRegular(scores, squares, i);
  }

  return getScoresCutthroat(scores, squares, i, numPlayers);
}


function getScoresRegular(scores, squares, i) {
  if (i % 2 === 0 && squares[i + 1] !== "Ⓧ") {
    if (i === 12) {
      scores[0] += 25;
    }
    else {
      scores[0] += 20 - i/2;
    }
  }

  else if (i % 2 === 1 && squares[i - 1] !== "Ⓧ"){
    if (i === 13) {
      scores[1] += 25;
    }
    else {
      scores[1] += 20 - (i - 1)/2;
    }
  }

  return scores;
}


function getScoresCutthroat(scores, squares, i, numPlayers) {
  let column = i % numPlayers;
  let start = 0 - column;

  for (let j = start; j < start + numPlayers; j++) {
    if (i + j !== column && squares[i + j] !== "Ⓧ") {
      if ((i + start)/numPlayers <= 5) {
        scores[(i + j) % numPlayers] += 20 - (i + start)/numPlayers;
      }
      else {
        scores[(i + j) % numPlayers] += 25;
      }
    }
  }

  return scores;
}


function declareWinner(closedAll, scores, numPlayers) {
  if (numPlayers === 2) {
    return getWinnerRegular(closedAll, scores);
  }

  return getWinnerCutthroat(closedAll, scores, numPlayers);
}

function getWinnerRegular(closedAll, scores) {
  if (closedAll[0] && scores[0] >= scores[1]) {
    return "Player 1 wins.";
  }

  if (closedAll[1] && scores[1] >= scores[0]) {
    return "Player 2 wins.";
  }

  return "";
}

function getWinnerCutthroat(closedAll, scores, numPlayers) {
  for (let i = 0; i < numPlayers; i++) {
    if (closedAll[i]) {
      let iWon = true;
      for (let j = 0; j < numPlayers; j++) {
        if (i !== j) {
          if (scores[j] < scores[i]) {
            iWon = false;
            j = numPlayers;
          }
        }
      }
      if (iWon) {
        return "Player " + (i + 1).toString() + " wins.";
      }
    }
  }

  return "";
}


function didCloseAll(squares, i, numPlayers) {
  for (let j = i % numPlayers; j < 7*numPlayers; j+= numPlayers) {
    if (squares[j] !== "Ⓧ") {
      return false;
    }
  }

  return true;
}
