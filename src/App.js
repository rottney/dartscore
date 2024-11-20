//import logo from './logo.svg';
//import './App.css';

import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import Game from "./Game.jsx";
//import Session from "./Session.jsx";
import CricketBoard from "./CricketBoard.jsx";
import ThreeOhOneBoard from "./ThreeOhOneBoard";

import "./index.css"

function App() {
    ///*
    return (
        <Router>
            <Routes>
                <Route 
                    path="/" 
                    element={<Game/>}
                />
                {/*<Route 
                    path="/cricket/:id"
                    element={<CricketBoard/>}
                />*/}
                <Route path="cricket">
                    <Route
                        path=":id"
                        element={<CricketBoard/>}
                    />
                </Route>

                <Route 
                    path="/301/:id"
                    element={<ThreeOhOneBoard/>}
                />
            </Routes>
        </Router>
    );
    //*/

    /*
    return (
        <Game/>
    )
    */
}

export default App;
