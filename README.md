
# Huechan Place

![CI](https://github.com/huetrashme0947/huechan-place-backend/actions/workflows/ci.yml/badge.svg)

Huechan Place is a server implementing an r/place inspired service, where users can draw a tile in a set interval and receive real-time canvas updates over a WebSocket connection. It also supports features like canvas expansion/reduction on a set timestamp and the 'Special Mode', during which only two special tile colors can be drawn.

- Uses WebSocket for real-time communication with clients
- Uses Redis for fast tile manipulation and retrieval
- Stores timestamps of last change of tiles
- Customizable draw cooldown
- Customizable canvas sizes
- Canvas expansion/reduction events
- The 'Special Mode'

## Building

Clone the repository:

```bash
git clone https://github.com/huetrashme0947/huechan-place-backend
cd huechan-place-backend
```

Install dependencies and build:

```bash
npm ci
npx tsc
```

Start the server:

```bash
node build/index.js
```