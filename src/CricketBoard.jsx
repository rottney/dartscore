import React, { useEffect, useState } from "react";
import Square from "./Square.jsx";
import "./index.css";

import { useParams } from "react-router-dom";
import io from "socket.io-client";


function getGameId() {
    const baseUrl = "http://localhost:3000/cricket/";   // change to vercel url later?
    const fullUrl = window.location.href;

    return fullUrl.replace(baseUrl, "");
}


export default function CricketBoard() {
    const gameId = getGameId();

    const [history, setHistory] = useState([]);
    const [numPlayers, setNumPlayers] = useState(0);
    const [playerNames, setPlayerNames] = useState([]);


    async function getStateFromServer(gameId) {
        const url = `http://localhost:5000/cricket/${gameId}`;
    
        try {
            const res = await fetch(url);
            const data = await res.json();
            console.log(Date.now());
            console.log(data);
            
            setHistory(history.concat(data["history"]));
            setNumPlayers(data["num_players"]);
            setPlayerNames(data["player_names"]);
        }
        catch(e) {
            console.error(e);
        }
    }

    if (numPlayers === 0) {
        getStateFromServer(gameId);
    }

    function handleClick(i) {
        const current = history[history.length - 1];
        let squares = current.squares.slice();
        let scores = current.scores.slice();
        let closedAll = current.closed_all.slice();
        console.log(closedAll);

        if (declareWinner(closedAll, scores, numPlayers, playerNames) === "") {
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

        setHistory(
            history.concat({
                squares: squares,
                scores: scores,
                closed_all: closedAll,
            })
        );
    }

    function undo() {
        setHistory(
            history.slice(0, history.length - 1)
        );
    }

    function renderUndoButton() {
        if (history.length > 1) {
            return (
                <button onClick={() => undo()}>
                    Undo last step
                </button>
            );
        }
        else {
            return <p></p>;
        }
    }

    function newGame() {
        let newGame = window.confirm("Are you sure you want to start a new game?  "
            + "Your progress will not be saved.");
        if (newGame) {
            window.location.reload();
        }
    }

    function renderNewGameButton() {
        return (
            <button onClick={() => newGame()}>
                Start new game
            </button>
        );
    }

    function renderSquare(i) {
        const current = history[history.length - 1];
        const squares = current.squares;

        return (
            <Square 
                value={squares[i]}
                onClick={() => handleClick(i)}
            />
        );
    }


    let current = [];
    let myScores = [];
    let closedAll = [];

    if (history.length > 0) {
        current = history[history.length - 1];
        myScores = current.scores;
        closedAll = current.closed_all;
    }

    // Generate team names
    let teamNames = [];
    for (let i = 0; i < numPlayers; i++) {
        teamNames.push(<div className="score">{playerNames[i]}</div>);
    }

    // Generate board
    let board = [];

    for (let i = 0; i < 7; i++) {
        let row = [];

        for (let j = 0; j < numPlayers; j++) {
            row.push(renderSquare(numPlayers*i + j));
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

    // Determine winner
    const winner = (
        <div className="status">
            {declareWinner(closedAll, myScores, numPlayers, playerNames)}
        </div>
    );
    
    // Undo button
    const undoButton = renderUndoButton();

    // New game button
    const newGameButton = renderNewGameButton();

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

function declareWinner(closedAll, scores, numPlayers, playerNames) {
    if (numPlayers === 2) {
        return getWinnerRegular(closedAll, scores, playerNames);
    }

    return getWinnerCutthroat(closedAll, scores, numPlayers, playerNames);
}

function getWinnerRegular(closedAll, scores, playerNames) {
    if (closedAll[0] && scores[0] >= scores[1]) {
        const winner = playerNames[0];
        return winner.toString() + " wins.";
    }

    if (closedAll[1] && scores[1] >= scores[0]) {
        const winner = playerNames[1];
        return winner.toString() + " wins.";
    }

    return "";
}

function getWinnerCutthroat(closedAll, scores, numPlayers, playerNames) {
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
                const winner = playerNames[i];
                return winner.toString() + " wins.";
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
