# 👻 Ghost in the Graveyard simulation

A simple multi-agent simulation of an outdoor game for children, named "*Ghost in the Graveyard*".
Inspired by the Belief-Desire-Intention (BDI) agent modelling approach.

## Description

The simulation follows the following rules of the game, with some minor adjustments:

All agents are placed randomly in the grid world. The **Ghosts** and **Players** "wander" around. If a Player finds a Ghost, it stops and notifies all other Players that a Ghost has been found. Any player that finds a Ghost is considered to be "safe". All Players except the one that found the Ghost run to the **Exit**. The found Ghost starts moving towards the closest Player other than the one that found it in an attempt to "catch" it. If the Ghost catches a Player, the latter becomes a Ghost that starts wandering. All players that arrive at the Exit cell disappear from the grid.

## Getting Started

### Notable Dependencies

* React
* TypeScript
* konva and react-konva (HTML5 canvas and respective bindings for React)
* styled-components (component styling)
* pathfinding (calculation of the shortest path between agents)

### Installing

* Download or clone with git this repository from https://github.com/Vixan/ghost-in-the-graveyard


### Executing program

1. Install dependencies
    ```
    npm install
    ```
1. Start development server
    ```
    npm start
    ```

## Authors

[Duca Vitalie-Alexandru](https://github.com/Vixan)

## Version History

* 0.1
    * Initial Release

## License

This project is licensed under the MIT License - see the LICENSE.md file for details

## Acknowledgments

Inspiration, code snippets, etc.
* [Gama Platform](https://github.com/gama-platform/gama)
* [gragland](https://github.com/gragland/usehooks)