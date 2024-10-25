import React from 'react';
import Square from './Square.jsx';
import './index.css';

class ThreeOhOneBoard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      numPlayers: props.numPlayers,
      playerNames: props.playerNames,
      /*
      history: [{
        squares: Array(7*props.numPlayers).fill(null),
        scores: Array(props.numPlayers).fill(0),
        closedAll: Array(props.numPlayers).fill(false),
      }],
      */
    };
  }

  render() {
    return (
      <div>
        <p>{"TODO: implement 301 board"}</p>
        <p>{"refresh page to restart and play cricket"}</p>
      </div>
    );
  }
}

export default ThreeOhOneBoard;
