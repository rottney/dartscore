import React from 'react';
import './index.css';


class ThreeOhOneBoard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      numPlayers: props.numPlayers,
      playerNames: props.playerNames,
      history: [{
        turnScores: Array(props.numPlayers).fill(-1),     // converts any busts to 0
        displayScores: Array(props.numPlayers).fill(-1),  // will save values even that bust
        finalScores: Array(props.numPlayers).fill(301),
      }],
      currentPlayer: 0,
      currentScore: "",
    };
  }

  setCurrentScore = (e) => {
    this.setState({currentScore: e.target.value})
  }

  addNewScore(player) {
    const numPlayers = this.state.numPlayers;
    const history = this.state.history;
    const current = history[history.length - 1];
    let turnScores = current.turnScores.slice();
    let displayScores = current.displayScores.slice();
    let finalScores = current.finalScores.slice();
    const currentScore = this.state.currentScore;

    if (currentScore < 0) {
      alert("Score can not be negative.");
    }
    else if (currentScore > 180) {
      alert("Score greater than 180 is not possible in a single turn.");
    }
    else if (isNaN(currentScore)) {
      alert(`${currentScore} is not an integer - please only enter integers.`);
    }
    else if (currentScore === "") {
      alert("Input is empty - please enter a valid integer.");
    }
    else {
      if (player === 0) {
        turnScores = Array(numPlayers).fill(-1);
        displayScores = Array(numPlayers).fill(-1);
      }

      displayScores[player] = currentScore;

      if (isBust(finalScores, player, currentScore) === true) {
        turnScores[player] = 0;
      }
      else {
        turnScores[player] = currentScore;
        finalScores[player] = finalScores[player] - currentScore;
      }
  
      // set "next" player:
      if (player === numPlayers - 1) {
        player = 0;
      }
      else {
        player++;
      }
      
      this.setState(
        {
          history: history.concat({
            turnScores: turnScores,
            displayScores: displayScores,
            finalScores: finalScores,
          }),
          currentPlayer: player,
          currentScore: "",
        }
      );
    }
  }

  addNewScoreButton(player) {
    const currentPlayer = this.state.currentPlayer;
    const gameOver = this.state.gameOver;
    const disabled = player !== currentPlayer || gameOver === true;

    let inputBox = "";
    if (player === currentPlayer) {
      inputBox = (
      <input 
        value={this.state.currentScore}
        onChange={this.setCurrentScore}
        size={"5"}
      />);
    }
    
    return (
      <div className="column">
        <button disabled={disabled} onClick={() => this.addNewScore(player)}>+</button>
        {inputBox}
      </div>
    );
  }

  undo() {
    const history = this.state.history;
    let player = this.state.currentPlayer;

    if (player === 0) {
      player = this.state.numPlayers - 1;
    }
    else {
      player--;
    }

    this.setState({
      history: history.slice(0, history.length - 1),
      currentPlayer: player,
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

  // copied exactly from CricketBoard code - should refactor
  newGame() {
    let newGame = window.confirm("Are you sure you want to start a new game?  "
      + "Your progress will not be saved.");
    if (newGame) {
      window.location.reload();
    }
  }

  renderNewGameButton() {
    return (
      <button onClick={() => this.newGame()}>
        Start new game
      </button>
    );
  }

  render() {
    const numPlayers = this.state.numPlayers;
    const playerNames = this.state.playerNames;
    const history = this.state.history;
    const current = history[history.length - 1];
    const finalScores = current.finalScores;

    let teamNames = [];
    const addNewScoreButtons = [];
    for (let i = 0; i < numPlayers; i++) {
      // Generate team names
      teamNames.push(<div className="score">{playerNames[i]}</div>);
      // "Add new score" buttons if applicable
      if (declareWinner(finalScores, playerNames) === "") {
        addNewScoreButtons.push(this.addNewScoreButton(i));
      }
    }
    
    // Generate board
    let board = [];
    for (let i = 0; i < history.length; i++) {
      let row = [];
      for (let j = 0; j < numPlayers; j++) {
        let displayScore = "";
        if (history[i].displayScores[j] !== -1) {
          displayScore = history[i].displayScores[j];
        }
        let className = "column";
        if (history[i].turnScores[j] !== history[i].displayScores[j]) {
          className += " bust";
          displayScore += " [bust]"
        }
        row.push(<div className={className}>{displayScore}</div>)
      }
      if (i % numPlayers === 0 || i === history.length - 1) {
        board.push(<div>{row}</div>)
      }
    }

    // Generate final scores
    let finalScoresRow = [];
    for (let i = 0; i < numPlayers; i++) {
      let className = "column";
      if (finalScores[i] === 0) {
        className += " win";
      }
      finalScoresRow.push(<div className={className}>{finalScores[i]}</div>)
    }

    // Determine winner
    const winner = (
      <div className="status">
        {declareWinner(finalScores, playerNames)}
      </div>
    );

    // Undo button
    const undoButton = this.renderUndoButton();

    // New game button
    const newGameButton = this.renderNewGameButton();

    return (
      <div>
        <div>{teamNames}</div>
        <div>{addNewScoreButtons}</div>
        <div>{board}</div>
        <br/>
        <div>{"TOTAL SCORES:"}</div>
        <div>{finalScoresRow}</div>
        <div>{winner}</div>
        <div>{undoButton}</div>
        <div>{newGameButton}</div>
      </div>
    );
  }
}

export default ThreeOhOneBoard;

// ========================================

function isBust(finalScores, player, currentScore) {
  if (finalScores[player] - currentScore < 0) {
    return true;
  }
  return false;
}

function declareWinner(finalScores, playerNames) {
  for (let i = 0; i < finalScores.length; i++) {
    if (finalScores[i] === 0) {
      const winner = playerNames[i];
      return `${winner} wins.`
    }
  }
  return "";
}
