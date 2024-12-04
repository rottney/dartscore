# Dartscore - Score a game of darts
<img width="374" alt="dartscore_cricket" src="https://github.com/user-attachments/assets/f5420154-d45e-4685-afff-f115694cfd8c">
<img width="412" alt="dartscore_301" src="https://github.com/user-attachments/assets/869f676a-e5e9-45cc-a670-3ab56647e416">

## Summary
Dartscore is a simple darts scoring web app written in React. It can be used to score a game of [Cricket](https://www.dartslive.com/beginner/en/cricket/) or [301](https://www.dartslive.com/beginner/en/01/) darts for 2-4 players. It runs on any browser and is written with a mobile-first approach - very handy when the pub is out of chalk!

This project is one of two primary portfolio pieces I created at [The Recurse Center](https://www.recurse.com/) in Brooklyn during the Fall of 2024. The site is hosted using Vercel and can be accessed at [dartscore.vercel.app](https://dartscore.vercel.app/).

## Features
**Universal**
* 2, 3, or 4 players
* Undo last step - reverts game to the previous state, in case a turn was incorrectly entered

**Cricket mode**
* **Point accumulation:** in 2-player mode, a player accumulates _points_ when they hit a number they have closed and their opponent hasn't. The first player to close each number (15 - 20 and Bull) and reach a point score greater than or equal to their opponent wins.
* **Cutthroat points:** in 3- or 4-player mode, the point accumulation is reversed; after a player has closed a number, each subsequent hit on that number gives points to the opponents who have _not_ closed that number. The first player to close 15 - 20 and Bull with the _lowest_ (or equal to the lowest) score wins.

**301 mode**
* **Point validation:** as the per-round points are entered into a text box, the application validates that the score is valid for a standard 3-dart round. For example, negative values, values greater than 180, and non-integer values are invalid. The application provides a specific error message when the score is out of bounds.
* **Busts:** If a player _busts_, i.e. goes below 0 on their final score, the score for that round is marked, but the total score remains unchanged, and the busted score is rendered in red.

## Future enhancement (in-progress)
This application works great on a large shared screen (like a laptop), but the user experience is poor on mobile because whoever is keeping score must pass their phone to everyone playing, or mark everyone's score themself. To improve this experience, I am implementing a backend using Flask so that each game is assigned a unique session ID that can be shared between everyone playing that game (the ID will be appended to the application's root URL). The communication between the clients and server will be handled using WebSocket so that one player's changes will be rendered across all players' devices.

## Feedback?
If you notice any issues while using the app, please feel free to open a bug report using the [Issues](https://github.com/rottney/dartscore/issues) tab and I will get it fixed as quickly as possible.

Contributions welcome! Please reach out at rottney123@gmail.com if interested and I will be happy to get you onboarded. 🙂
