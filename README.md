# Keibot

A board game that combines elements of chess and tic-tac-toe with Easter Island-inspired graphics originally developed by Glen Solosky (released for the Macintosh in 1995).

Live demo: https://tests.arfeo.net/keibot/

## The game

There are 3 ways to win `Keibot` (pronounced Key-bo):

1.  Get 3 beads in a row (horizontally, vertically, or diagonally)
1.  Capture 3 of your opponent's statues
1.  Place all ten of your beads on the board

(Actually, there is a fourth way to win, but it happens very rarely — trap your opponent so he can't move.)

The statues move like knights in chess (an L-shaped move, two squares horizontally or vertically and then one square perpendicularly). To move a piece, click on its square, then on the destination square.

Place your beads by aligning yourself with your opponent, with one square in between — a bead goes in that square.

Capture your opponent's statues by landing on them (except for the last to move — he's safe.  He's the one with a shield).

## Scheduled features
   
- [ ] Timers
- [ ] Computer player

## Installation

Clone the project:

```
$ git clone https://github.com/arfeo/Keibot.git && cd Keibot
```

Run:

```
$ yarn
```

```
$ yarn start
```

Build:

```
$ yarn build
```

