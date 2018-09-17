function createNewGame() {
  const gameId = getRandomWord() + getRandomWord() + getRandomWord();
  const game = { players: {}, status: "LOBBY" };
  gamesById[gameId] = game;
  return gameId;
}
