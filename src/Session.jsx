import React, { useState } from "react";
import CricketBoard from "./CricketBoard.jsx";
import ThreeOhOneBoard from "./ThreeOhOneBoard.jsx";


export default function Session( {gameType, numPlayers, playerNames} ) {
    const [sessionId, setSessionId] = useState("");
    const [start, setStart] = useState(false);

    function generateNewSession() {
        const uuid = crypto.randomUUID();   // change to call to backend
        setSessionId(uuid);
    }

    function startGame() {
        setStart(true);
    }


    if (sessionId === "") {
        return (
            <button onClick={() => generateNewSession()}>
                Generate new session
            </button>
        );
    }
    else if (start === false) {
        return (
            <div>
                <p>Share this URL if you would like to play 
                    across multiple devices:<br/>
                    {`http://dartscore.vercel.app/${gameType}/${sessionId}`}
                </p>
                <button onClick={() => startGame()}>
                    Start game
                </button>
            </div>
        );
    }
    else {
        if (gameType === "cricket") {
            return (
                <CricketBoard
                    numPlayers={numPlayers}
                    playerNames={playerNames}
                />
            );
        }
        else {
            return (
                <ThreeOhOneBoard
                    numPlayers={numPlayers}
                    playerNames={playerNames}
                />
            );
        }
    }
}
