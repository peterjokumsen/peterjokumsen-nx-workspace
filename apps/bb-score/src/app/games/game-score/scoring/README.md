# Scoring system

The thinking for this is to have a scoring system that will track the game and allow for statistics of the game and the players.

It will need to have awareness of the game, the players

## Types of actions

| Category | Action   | Result                                            |
| -------- | -------- | ------------------------------------------------- |
| Game     | `start`  | Game status updated, batting starts for away team |
| Batting  | `strike` | Strike count up                                   |
| Batting  | `ball`   | Ball count up                                     |
