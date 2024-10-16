import React from 'react';
import Board from './Board.jsx';  
import './index.css';


class Game extends React.Component {
  constructor() {
    super();
    this.state = ({
      numPlayers: 0,
      playerNames: [],
      currentName: 'Name',
    });
  }

  namePlayers(e) {
    e.preventDefault();

    const playerName = this.state.currentName;

    const playerNames = this.state.playerNames;
    playerNames.push(playerName);

    this.setState({playerNames: playerNames, currentName: 'Name'});
  }

  handleNameChange(e) {
    this.setState({currentName: e.target.value});
  }

  handleClick(i) {
    this.setState({numPlayers: i});
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
          <form onSubmit={this.namePlayers.bind(this)}>
            <input 
              name="name" 
              value={this.state.currentName} 
              onChange={this.handleNameChange.bind(this)} 
            />
            <button type="submit">Save</button>
          </form>
        </div>
      );
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            numPlayers={numPlayers}
            playerNames={playerNames}
          />
        </div>
      </div>
    );
  }
}

export default Game;
