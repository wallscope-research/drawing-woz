# Collaborative Drawing Game
### 👩‍🎨🎨👨‍🎨.

This canvas has been built upon to create a more fleshed out drawing game for research.

## Guide:

Creating a local server. Hosting a shared, collaborative drawing canvas.
Broadcasting messages between clients and the server using node, express, p5.js and socket.io.

This section describes the game setup and then how to play.

### Installation and Setup

To run this code:
Make sure you have node and npm installed on your machine.

1. Clone this repository.
2. Open the cloned directory in your terminal.
3. Replace the accountID and password in `config.json` with your Cereproc credentials.
4. Run: ```npm install```
5. Run: ```node server.js```
6. Open Player 1 running at: http://localhost:3000/?id=1
7. Open Player 2 running at: http://localhost:3000/?id=2

### How to Play

#### Objective

Player 1 is the player that chooses a picture and has to instruct Player 2 how to draw the chosen picture (without saying what is is!!).

Player 2 has to follow Player 1's instructions to draw the picture. Once they think they know what they are drawing, Player 2 has can enter their guess. Guessing ends the round!

#### Steps

Each player first selects their vID (chosen voice ID) in the top-left of their screens. Player 1 also enters what their chosen picture is.

Player one can then instruct Player 2 how to draw their picture (max 40 words at a time).

Player 2 draws and can say one of three things:

1. Could you please repeat that?
2. Can you clarify?
3. Ok, What's next?

Once player 2 thinks they know what they are drawing, they enter and submit their guess. This ends the game. Player 1 will see their guess and Player 2 will see what the correct answer is.

To start a new round, both players can click Switch Player.

![Alt Text](./demo/demo.gif)

Inspired by [Daniel Shiffman ("The Coding Train")](https://www.youtube.com/watch?v=bjULmG8fqc8 "The Coding Train")
