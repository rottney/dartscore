import React, { useState } from "react";
import { Link } from "react-router-dom";


export default function Session( {gameType, numPlayers, playerNames} ) {
    const [gameId, setGameId] = useState("");


    async function generateNewSession() { 
        const url = `http://localhost:5000/create_game?num_players=${numPlayers}&player_names=${playerNames}`;
        
        try {
            const res = await fetch(url);
            const data = await res.json();
            const id = data["game_id"];
            setGameId(id);
        }
        catch(e) {
            console.error(e);
        }
    }


    if (gameId === "") {
        generateNewSession();

        return (
            <div></div>
        );
    }
    else {
        return (
            <div>
                <div>Share the following link if you would like to play across multiple devices.<br/>Click to start:</div>
                <Link to={`${gameType}/${gameId}`}>{`http://dartscore.vercel.app/${gameType}/${gameId}`}</Link>
            </div>
        );
    }
}
