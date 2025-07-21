# Particle Mayhem

A simple Phaser 3 experiment: one particle bounces around the screen, doubling into two new particles every time it hits a wall. Each particle is a random color, and a sound effect plays (with random pitch) on every bounce. The simulation grows exponentially and creates a colorful, chaotic effect.

## Setup

1. Install dependencies:
```
npm install
```

2. Add your `pickupCoin.wav` sound file to the `src/` directory (or use the provided one).

3. Start the local server:
```
npm start
```

4. Open your browser to the provided local URL (usually http://localhost:3000).

5. Click anywhere on the screen to start the simulation and enable sound.

## Features
- Exponential particle doubling on bounce
- Random color for each particle
- Sound effect with random pitch on every bounce
- "Click to Start" overlay to enable audio

## Requirements
- Node.js
- npm

## License
MIT 