import React, { useState } from "react";
//import CricketBoard from "./CricketBoard.jsx";
//import ThreeOhOneBoard from "./ThreeOhOneBoard.jsx";
import { Link } from "react-router-dom";


export default function Session( {gameType, numPlayers, playerNames} ) {
    const [sessionId, setSessionId] = useState("");


    async function generateNewSession() { 
        const url = `http://localhost:5000/create_game?num_players=${numPlayers}&player_names=${playerNames}`;
        
        try {
            const res = await fetch(url);
            const data = await res.json();
            const id = data["game_id"];
            setSessionId(id);
        }
        catch(e) {
            console.error(e);
        }
    }


    if (sessionId === "") {
        generateNewSession();
        
        return (
            <div></div>
        );
    }
    else {
        return (
            <div>
                <p>Share the following link if you would like to play across multiple devices. Click to start:</p>
                <Link to={`${gameType}/${sessionId}`}>{`http://dartscore.vercel.app/${gameType}/${sessionId}`}</Link>
            </div>
        );
    }
}
