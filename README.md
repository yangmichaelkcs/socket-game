## Avalon / Resistance Type Game Mobile Webapp

- Goal is to make a game that is similar to Avalon / Resistance that can be played with multiple phones connected over socket connection to the same Webapp

## How to Use

### Server

- Server is a simple NodeJS web server that uses socket.io, currently transitioning it to TypeScript
- Run with `ts-node server.ts`
- Or `nodemon server.ts --exec 'ts-node'` for live updates
- Side side note: seems like `nodemon` does seem to eat some exception messages making it sometimes hard to debug server failures

### Client

- Client is a react webapp that uses socket.io client
- Run with `npm start`
- You might need a `.env` file with `NODE_PATH=src/` to get absolute path resolution working
