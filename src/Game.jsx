import React from 'react';
import CricketBoard from './CricketBoard.jsx';
import ThreeOhOneBoard from './ThreeOhOneBoard.jsx';
import './index.css';


class Game extends React.Component {
  constructor() {
    super();
    this.state = ({
      numPlayers: 0,
      playerNames: [],
      currentName: "",
      gameType: "",
    });
  }

  namePlayers = (e) => {
    e.preventDefault();

    const playerName = this.state.currentName;

    const playerNames = this.state.playerNames;
    playerNames.push(playerName);

    this.setState({playerNames: playerNames, currentName: ""});
  }

  handleNameChange = (e) => {
    this.setState({currentName: e.target.value});
  }

  handleClick(i) {
    this.setState({numPlayers: i});
  }
  
  setGameType(type) {
    this.setState({gameType: type});
  }

  render() {
    const numPlayers = this.state.numPlayers;
    const playerNames = this.state.playerNames;

    if (numPlayers === 0) {
      return (
         <div class="dropdown">
          <button class="dropbtn"># Players:</button>
          <div class="dropdown-content">
            <a onClick={() => this.handleClick(2)}>2</a>
            <a onClick={() => this.handleClick(3)}>3</a>
            <a onClick={() => this.handleClick(4)}>4</a>
          </div>
        </div> 
      );
    }

    if (playerNames.length < numPlayers) { 
      return (
        <div>
          <p>Player {numPlayers - (numPlayers - playerNames.length) + 1} enter name:</p>
          <form onSubmit={this.namePlayers}>
            <input 
              name="name" 
              value={this.state.currentName} 
              onChange={this.handleNameChange} 
            />
            <button type="submit">Save</button>
          </form>
        </div>
      );
    }

    const gameType = this.state.gameType;
    if (gameType === "") {
      return (
        <div class="dropdown">
          <button class="dropbtn">Game Type:</button>
          <div class="dropdown-content">
            <a onClick={() => this.setGameType("cricket")}>Cricket</a>
            <a onClick={() => this.setGameType("301")}>301</a>
          </div>
        </div>
      );
    }

    else if (gameType === "cricket") {
      return (
        <div className="game">
          <div className="game-board">
            <CricketBoard
              numPlayers={numPlayers}
              playerNames={playerNames}
            />
          </div>
        </div>
      );
    }

    else {
      return (
        <div className="game">
          <div className="game-board">
            <ThreeOhOneBoard
              numPlayers={numPlayers}
              playerNames={playerNames}
            />
          </div>
        </div>
      );
    }
  }
}

export default Game;
