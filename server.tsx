import * as randomWord from "random-word";
import * as socketIo from "socket.io";
import {
  Game,
  Player,
  TEAM,
  GAME_STATUS,
  ROUND_STATUS,
  PLAYER_DISTRIBUTION,
  VOTE_INDEX,
  ROUND_REQ,
  SPECIAL_CHAR_INDEX,
  ROLES,
  SCORE_TYPE
} from "./src/types/types";

const port = 8888;
const io = socketIo.listen(port);

const gamesById: { string?: Game } = {};

/* Random Word */
function capitalizeFirstLetter(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function getRandomWord() {
  return capitalizeFirstLetter(randomWord());
}

// Returns random word of shorter than nameLength
function getRandomName(nameLength) {
  let name = capitalizeFirstLetter(randomWord());
  while(name.length > nameLength) {
    name = capitalizeFirstLetter(randomWord());
  }
  return name;
}
/* Random Word */

/* Get Game */
const getGameIdBySocket = socket => {
  const rooms = Object.keys(socket && socket.rooms);
  return rooms && rooms[rooms.length - 1];
};

const getGameBySocket = socket => {
  return getGameById(getGameIdBySocket(socket));
};

const getGameById = gameId => {
  return gamesById[gameId];
};
/* Get Game */

/* Init */
const createNewGame = () => {
  let id = getRandomWord() + getRandomWord()
  while( gamesById[id] !== undefined) {
    id = getRandomWord() + getRandomWord()
  }
  const game = {
    players: [],
    includes: [false, false, false, false],
    status: GAME_STATUS.LOBBY,
    id,
    failedVotes: 0,
    currentRound: 1,
    score: [0, 0],
    currentPlayerTurn: "",
    rounds: [
      { id: 1, value: null, playersNeeded: 0, failsNeeded: 0 },
      { id: 2, value: null, playersNeeded: 0, failsNeeded: 0 },
      { id: 3, value: null, playersNeeded: 0, failsNeeded: 0 },
      { id: 4, value: null, playersNeeded: 0, failsNeeded: 0 },
      { id: 5, value: null, playersNeeded: 0, failsNeeded: 0 }
    ],
    votes: [0, 0],
    roundStatus: ROUND_STATUS.PROPOSING_TEAM
  };
  gamesById[id] = game;
  return id;
};

const addPlayerToGame = (gameId, socket) => {
  const game: Game = getGameById(gameId)
  if(game.status != GAME_STATUS.IN_PROGRESS) { 
    const player: Player = {
      socketId: socket.id,
      nickName: `${getRandomName(7)}`,
      role: ROLES.NONE,
      selected: 0,
      team: null
    };
    socket.join(gameId);
    game.players.push(player);
    return true;
  }
  else {
    const dupGame = Object.assign({}, game);
    dupGame.status = GAME_STATUS.REJOIN;
    socket.join(gameId);
    socket.emit("NAV_MAIN_MENU", dupGame);
    return false;
  }
};

const startGame = (gameId: string, includes: boolean[]) => {
  const game: Game = gamesById[gameId];
  game.includes = includes
  game.status = GAME_STATUS.IN_PROGRESS;
  game.roundStatus = ROUND_STATUS.PROPOSING_TEAM;
  game.players = shuffle(game.players);
  game.currentPlayerTurn = game.players[0].socketId;
  game.failedVotes = 0;
  game.currentRound = 1;
  game.score = [0, 0];
  game.rounds.forEach(round => { 
    const id = round.id
    round.playersNeeded = ROUND_REQ[id][game.players.length].playerNeed;
    round.failsNeeded = ROUND_REQ[id][game.players.length].failNeed;
  });
};

const shuffle = (players: Player[]): Player[] => {
  let currentIndex = players.length;
  let temporaryValue;
  let randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = players[currentIndex];
    players[currentIndex] = players[randomIndex];
    players[randomIndex] = temporaryValue;
  }

  return players;
};

const assignRoles = (gameId: string, includes: boolean[]) => {
  const players: Player[] = gamesById[gameId].players;
  const  badPlayers = [];
  const goodPlayers = [];
  let badPlayersRoleIndex = 0;
  let goodPlayersRoleIndex = 0;
  var numBadPlayer = 0;
  while(numBadPlayer < PLAYER_DISTRIBUTION[players.length].bad) {
    let index = Math.floor(Math.random() * players.length)
    if(players[index].team === null || players[index].team === undefined) {
      players[index].team = TEAM.BAD;
      numBadPlayer++;
      badPlayers.push(index);
    }
  }
  for(var i = 0; i < players.length; i++) { 
    if(players[i].team === null || players[i].team === undefined) {
      players[i].team = TEAM.GOOD;
      goodPlayers.push(i);
    }
  }

  if(includes[SPECIAL_CHAR_INDEX.ASSMERLIN]) {
    players[badPlayers[badPlayersRoleIndex]].role = ROLES.ASSASSIN
    players[goodPlayers[goodPlayersRoleIndex]].role = ROLES.MERLIN
    badPlayersRoleIndex++;
    goodPlayersRoleIndex++;
  }

  if(includes[SPECIAL_CHAR_INDEX.MORDRED]) {
    players[badPlayers[badPlayersRoleIndex]].role = ROLES.MORDRED
    badPlayersRoleIndex++;
  }

  if(includes[SPECIAL_CHAR_INDEX.MORGANA]) {
    players[badPlayers[badPlayersRoleIndex]].role = ROLES.MORGANA
    badPlayersRoleIndex++;
  }

  if(includes[SPECIAL_CHAR_INDEX.PERCIVAL]) {
    players[goodPlayers[goodPlayersRoleIndex]].role= ROLES.PERCIVAL
    goodPlayersRoleIndex++;
  }

};

const updateIncludes = (socket, index) => {
  const game = getGameBySocket(socket);
  game.includes[index] = !game.includes[index];
}
/* Init */

/* Player */
const getPlayerBySocket = socket => {
  const game = getGameBySocket(socket);
  return game.players.find(player => player.socketId === socket.id);
};

const updatePlayerName = (socket, nickName) => {
  const player: Player = getPlayerBySocket(socket);
  player.nickName = nickName;
};

// Sets the player in corresponding game to param selected
const updatePlayerSelected = (socket, socketId, selected) => {
  const game: Game =  getGameBySocket(socket);
  
  const playerSelected = game.players.find(
    player => player.socketId === socketId
  );
  playerSelected.selected = selected;
};

// Makes next player the current player
const nextPlayerTurn = socket => {
  const game: Game = getGameBySocket(socket);
  const currPlayerIndex = game.players.findIndex(p => p.socketId === game.currentPlayerTurn);
  const nextPlayerIndex = (currPlayerIndex + 1) % game.players.length;
  game.currentPlayerTurn = game.players[nextPlayerIndex].socketId;
}

// Resets all players to unselected
const resetSelectPlayers = socket => {
  const game: Game = getGameBySocket(socket);
  game.players.forEach(player => player.selected = 0);
}
/* Player */

/* Round */
// Gets next round
const nextRoundStatus = roundStatus => {
  let nextStatus;
  switch(roundStatus) {
    case ROUND_STATUS.PROPOSING_TEAM:
      nextStatus = ROUND_STATUS.VOTING_TEAM;
      break;
    case ROUND_STATUS.VOTING_TEAM:
      nextStatus = ROUND_STATUS.VOTING_END;
      break;
    case ROUND_STATUS.VOTING_END:
      nextStatus = ROUND_STATUS.MISSION_IN_PROGRESS;
      break;
    case ROUND_STATUS.MISSION_IN_PROGRESS:
      nextStatus = ROUND_STATUS.MISSION_END;
      break;
    case ROUND_STATUS.MISSION_END:
      nextStatus = ROUND_STATUS.PROPOSING_TEAM;
      break;
  }
  return nextStatus;
}

// Sets next round to current round
const updateRoundStatus = socket => {
  const game: Game = getGameBySocket(socket);
  game.roundStatus = nextRoundStatus(game.roundStatus);
};

const updateSocketToNextRound = socket => {
  updateRoundStatus(socket);  
  let gameId = getGameIdBySocket(socket);
  io.to(gameId).emit("UPDATE_GAME_STATE", getGameById(gameId));
}
/* Round */

/* Votes */
// Updates the mission Vote
const updateVote = (socket, vote) => {
  const game: Game = getGameBySocket(socket);
  vote === -1 ? game.votes[VOTE_INDEX.NEG]++ : game.votes[VOTE_INDEX.POS]++;
}

// Updates team proposal vote and corresponding player
const updateTeamVote = (socket, vote, socketId) => {
  const game: Game = getGameBySocket(socket);
  vote === -1 ? game.votes[VOTE_INDEX.NEG]++ : game.votes[VOTE_INDEX.POS]++;
  const player = game.players.find(p => p.socketId === socketId);
  vote === -1 ? player.vote = -1 : player.vote = 1;
}

// Resets votes
const resetVotes = socket => {
  const game: Game = getGameBySocket(socket);
  game.votes[VOTE_INDEX.POS] = 0;
  game.votes[VOTE_INDEX.NEG] = 0;
  game.players.forEach(p => p.vote = 0);
}

// Checks if team proposal voting is complete
const checkVoteComplete = socket => {
  const game: Game = getGameBySocket(socket);
  if(game.roundStatus == ROUND_STATUS.VOTING_TEAM) {
    if(game.votes[VOTE_INDEX.NEG] + game.votes[VOTE_INDEX.POS] == game.players.length) {
      return true;
    }
  } 
}

// Checks if mission voting is complete
const checkMissionVoteComplete = socket => {
  const game: Game = getGameBySocket(socket);
  if(game.votes[VOTE_INDEX.NEG] + game.votes[VOTE_INDEX.POS] == game.rounds[game.currentRound - 1].playersNeeded) {
    return true;
  }
}

// Checks if team proposal votes is accept
const checkVoteSucceed = socket => {
  const game: Game = getGameBySocket(socket);
  const voteSucceed =  game.votes[VOTE_INDEX.POS] > game.votes[VOTE_INDEX.NEG] ? true : false;
  resetVotes(socket);
  return voteSucceed;
}

// Checks if mission succeeds 
const checkMissionSucceed = socket => {
  const game: Game = getGameBySocket(socket);
  const numFailNeeded = game.rounds[game.currentRound - 1].failsNeeded;
  return game.votes[VOTE_INDEX.NEG] < numFailNeeded; 
}

// Resets team failed proposal count
const resetFailedVotes = socket => {
  const game: Game = getGameBySocket(socket);
  game.failedVotes = 0;
}

const shuffleVotes = socket => {
  const game: Game = getGameBySocket(socket);
  const numVotes = game.votes[VOTE_INDEX.POS] + game.votes[VOTE_INDEX.NEG];
  let shuffledVoteArr = [];
  for(let i = 0; i < numVotes; i++) {
    if(game.votes[VOTE_INDEX.POS] > 0) {
      game.votes[VOTE_INDEX.POS]--;
      shuffledVoteArr[i] = 1;
    } else {
      game.votes[VOTE_INDEX.NEG]--;
      shuffledVoteArr[i] = -1;
    }
  }
  let currentIndex = numVotes;
  let temporaryValue;
  let randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = shuffledVoteArr[currentIndex];
    shuffledVoteArr[currentIndex] = shuffledVoteArr[randomIndex];
    shuffledVoteArr[randomIndex] = temporaryValue;

  }

  return shuffledVoteArr;
};
/* Votes */

/* Game Score */
const checkMerlinCorrect = (socket) => {
  const game: Game = getGameBySocket(socket);
  return game.players.find(player => player.role === ROLES.MERLIN).selected === 1
}

const checkAssassin = (socket) => {
  const game: Game = getGameBySocket(socket);
  return game.includes[SPECIAL_CHAR_INDEX.ASSMERLIN];
}

const updateToAssassinRound = (socket) => {
  const game: Game = getGameBySocket(socket);
  game.currentPlayerTurn = game.players.find(player => player.role === ROLES.ASSASSIN).socketId
  game.roundStatus = ROUND_STATUS.ASSASSIN_CHOOSE;
}

const updateToMerlinPicked = (socket) => {
  const game: Game = getGameBySocket(socket);
  game.roundStatus = ROUND_STATUS.MERLIN_PICKED;
}

// Updates game score
const updateScore = (socket, point) => {
  const game: Game = getGameBySocket(socket);
  if(point === TEAM.BAD) { 
    game.score[VOTE_INDEX.NEG]++;
    game.rounds[game.currentRound - 1].value = TEAM.BAD;
  } else {
    game.score[VOTE_INDEX.POS]++;
    game.rounds[game.currentRound - 1].value = TEAM.GOOD;
  }
  game.currentRound++;
}

// Check if a team has won, if no team has won return false
const checkWinner = socket => {
  const game: Game = getGameBySocket(socket);
  if(game.score[VOTE_INDEX.POS] === 3) {
    return TEAM.GOOD;
  }
  if(game.score[VOTE_INDEX.NEG] === 3) {
    return TEAM.BAD
  }
  return false;
}

// Moves game to mission end
const endGame = socket => {
  const game: Game = getGameBySocket(socket);
  game.roundStatus = ROUND_STATUS.MISSION_END;
}
/* Game Score */

// When team proposal is rejected then update and go to next player. If 5 rejects then returns false
const newTeamPropose = socket => {
  const game: Game = getGameBySocket(socket);
  resetSelectPlayers(socket);
  nextPlayerTurn(socket);
  game.failedVotes++;
  game.roundStatus = ROUND_STATUS.PROPOSING_TEAM;
  if(game.failedVotes === 5)
  {
    updateScore(socket, TEAM.BAD);
    resetFailedVotes(socket);
    return false; 
  }
};

// Async timeout
async function wait(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
};

io.on("connection", socket => {

  socket.on("disconnect", function() {
     console.log("user disconnected: " + socket.id);
  });

  socket.on("disconnecting", function () {
    const gameId = getGameIdBySocket(socket);
    socket.leave(gameId);
    io.of('/').in(gameId).clients(function(error, clients) {
      if (clients.length == 0) {
        delete gamesById[gameId];
      }
    });
  });

  socket.on("disconnecting", () => {
    const gameId = getGameIdBySocket(socket);
    if (gameId && gamesById[gameId]) {
      const game = gamesById[gameId];
      const playersList = game.players
      const playerIndex = playersList.findIndex(player => player.socketId === socket.id)
      // Lobby Case
      if(game.status === GAME_STATUS.LOBBY) {
        playersList.splice(playerIndex, 1);
        io.to(gameId).emit("UPDATE_GAME_STATE", getGameById(gameId));
        return;
      }
    }
  });

  // Creates a new game with the player who made the game
  socket.on("NEW_GAME", () => {
    const gameId: string = createNewGame();
    addPlayerToGame(gameId, socket);
    io.to(gameId).emit("JOINED_GAME", getGameById(gameId));
    socket.emit("SET_SOCKET_ID", socket.id);

    console.log(`${socket.id} created a new game with gameId: ${gameId}`);
  });

  // Joins an existing game based on game id
  socket.on("JOIN_GAME", gameId => {
    const gameIds = Object.keys(gamesById);
    if (gameIds.includes(gameId)) {
      if(!addPlayerToGame(gameId, socket)){
        console.log(`${socket.id} rejoining a game with gameId: ${gameId}`)
        return;
      }

      io.to(gameId).emit("JOINED_GAME", getGameById(gameId));
      socket.emit("SET_SOCKET_ID", socket.id);

      console.log(`${socket.id} joined a game with gameId: ${gameId}`);
    } else {
      const game = {status: GAME_STATUS.NON_EXIST}
      socket.emit("NAV_MAIN_MENU", game);
      console.log(`Game Id ${gameId} does not exist.`);
    }
  });

  // // Starts game and assign roles
  // socket.on("START_GAME", () => {
  //   const gameId = getGameIdBySocket(socket);
  //   if (gameId && gamesById[gameId]) {
  //     assignRoles(gameId);
  //     startGame(gameId);
  //     io.to(gameId).emit("GAME_STARTING", getGameById(gameId));
  //   }
  // });

    // Starts game and assign roles
    socket.on("START_GAME", (includes : boolean[]) => {
      const gameId = getGameIdBySocket(socket);
      if (gameId && gamesById[gameId]) {
        assignRoles(gameId, includes);
        startGame(gameId, includes);
        io.to(gameId).emit("GAME_STARTING", getGameById(gameId));
      }
    });

  // Updates nickname in lobby
  socket.on("UPDATE_NICKNAME", (nickName: string) => {
    updatePlayerName(socket, nickName);
    const gameId = getGameIdBySocket(socket);
    io.to(gameId).emit("UPDATE_GAME_STATE", getGameById(gameId));
  });

  // Updates nickname in lobby
    socket.on("UPDATE_INCLUDES", (index: number) => {
      updateIncludes(socket, index);
      const gameId = getGameIdBySocket(socket);
      io.to(gameId).emit("UPDATE_GAME_STATE", getGameById(gameId));
    });

  // Pick player makes player selected
  socket.on("PICK_PLAYER", (socketId: string, selected: number) => {
    updatePlayerSelected(socket, socketId, selected);
    const gameId = getGameIdBySocket(socket);
    io.to(gameId).emit("UPDATE_GAME_STATE", getGameById(gameId));
  });

  // Propose team moves game to next round state
  socket.on("PROPOSE_TEAM", () => {
    updateRoundStatus(socket);
    const gameId = getGameIdBySocket(socket);
    io.to(gameId).emit("UPDATE_GAME_STATE", getGameById(gameId));
  });

  // Kill Merlin
  socket.on("KILL_MERLIN", async() => {

    const gameId = getGameIdBySocket(socket);
    const game : Game = getGameBySocket(socket);
    updateToMerlinPicked(socket);

    // if Merlin picked correct
    if(checkMerlinCorrect(socket)) {
      game.score[VOTE_INDEX.NEG] = SCORE_TYPE.ASSASSIN;
    }
    io.to(gameId).emit("UPDATE_GAME_STATE", getGameById(gameId));

    await wait(5000);
    // Cleanup game
    gamesById[gameId].status = GAME_STATUS.END;
    io.to(gameId).emit("UPDATE_GAME_STATE", getGameById(gameId));
    io.of('/').in(gameId).clients(function(error, clients) {
    if (clients.length > 0) {
        clients.forEach(function (socket_id) {
            io.sockets.sockets[socket_id].leave(gameId);
        });
      }
    });
    delete gamesById[gameId];
    return;
  });

 /* Once voting is complete either sees if teams is accepted or not. 
  * Goes to next round status if team accepted, else increments failed vote for new team
  */
  socket.on("UPDATE_TEAM_VOTE",  async (vote : number, socketId: string) =>  {
    let gameId = getGameIdBySocket(socket);

    updateTeamVote(socket, vote, socketId);

    if(checkVoteComplete(socket)) {
      updateSocketToNextRound(socket);
      await wait(3000);

      // Go to Mission Voting
      if(checkVoteSucceed(socket)) {
        updateSocketToNextRound(socket);
      } 

      // Team proposal has failed
      else 
      { 
        // Should we propose a new team, has team proposal failed 5 times?
        if(!newTeamPropose(socket)) {

          // Evil team got a point, check if they won
          if(checkWinner(socket) === TEAM.BAD) {
            endGame(socket);
            await wait(5000);
            gamesById[gameId].status = GAME_STATUS.END;
            io.to(gameId).emit("UPDATE_GAME_STATE", getGameById(gameId));
            //Clean up game
            io.of('/').in(gameId).clients(function(error, clients) {
              if (clients.length > 0) {
                  clients.forEach(function (socket_id) {
                      io.sockets.sockets[socket_id].leave(gameId);
                  });
              }
            });
            delete gamesById[gameId];
            return;
          }
        }
        io.to(gameId).emit("UPDATE_GAME_STATE", getGameById(gameId));
      }
    }
  });

 /* Once voting is complete shuffle the votes and send to socket one by one
  * Updates score based on number of fails and goes to next round and checks to see if a team won
  */
  socket.on("UPDATE_MISSION_VOTE",  async (vote : number) =>  {
    updateVote(socket, vote);
    if(checkMissionVoteComplete(socket)) {
      const gameId = getGameIdBySocket(socket);

      // Shuffle the votes
      const shuffledVotesArr = shuffleVotes(socket);
      resetVotes(socket);

      // Updating Mission votes 2 seconds apart
      for(let i = 0; i < shuffledVotesArr.length; i++) {
        await wait(2000);
        if(shuffledVotesArr[i] === 1) {
          gamesById[gameId].votes[VOTE_INDEX.POS]++;
        }
        else {
          gamesById[gameId].votes[VOTE_INDEX.NEG]++;
        }
        io.to(gameId).emit("UPDATE_GAME_STATE", getGameById(gameId));
      }
      await wait(3000);

      // Check is mission succeeded or not based on fail requirements
      checkMissionSucceed(socket) ? updateScore(socket, TEAM.GOOD) : updateScore(socket, TEAM.BAD)
      updateSocketToNextRound(socket);
      await wait(3000);
      
      // Check if a team got 3 points
      if(checkWinner(socket)) {
        io.to(gameId).emit("UPDATE_GAME_STATE", getGameById(gameId));

        // If assassin is included
        if(checkAssassin(socket))
        {
          updateToAssassinRound(socket);
          resetSelectPlayers(socket);
          io.to(gameId).emit("UPDATE_GAME_STATE", getGameById(gameId));
          return;
        }
        // Assassin not included
        await wait(5000);
        gamesById[gameId].status = GAME_STATUS.END;
        io.to(gameId).emit("UPDATE_GAME_STATE", getGameById(gameId));
        
        // Cleanup game
        io.of('/').in(gameId).clients(function(error, clients) {
          if (clients.length > 0) {
              clients.forEach(function (socket_id) {
                  io.sockets.sockets[socket_id].leave(gameId);
              });
          }
        });
        delete gamesById[gameId];
        return;
      }

      // Reset things to next round
      resetVotes(socket);
      resetSelectPlayers(socket);
      resetFailedVotes(socket);
      nextPlayerTurn(socket);
      updateSocketToNextRound(socket);
    }
  });

  // Main menu button will send player back to main menu and remove that player from game
  socket.on("MAIN_MENU", () => {
    const gameId = getGameIdBySocket(socket);
    if (gameId && gamesById[gameId]) {
      const game = gamesById[gameId];
      const playersList = game.players
      const playerIndex = playersList.findIndex(player => player.socketId === socket.id)
      playersList.splice(playerIndex, 1);
      delete gamesById[gameId].players[socket.id];
      socket.to(gameId).emit("UPDATE_GAME_STATE", getGameById(gameId));
      socket.leave(gameId);
      socket.emit("NAV_MAIN_MENU", {});
      console.log(socket.id + " left the game with gameId: " + gameId)
     }
  });

  // Player rejoning game sets new socket id to all the right places
  socket.on("REJOIN_GAME", (nickName: string) => {
    const gameId = getGameIdBySocket(socket);
    if (gameId && gamesById[gameId]) {
      const playerList = gamesById[gameId].players
      const replacePlayer = playerList.find(player => player.nickName === nickName);
      if (replacePlayer.socketId === gamesById[gameId].currentPlayerTurn) {
        gamesById[gameId].currentPlayerTurn = socket.id;
      }
      replacePlayer.socketId = socket.id;
      socket.emit("SET_SOCKET_ID", socket.id);
      io.to(gameId).emit("UPDATE_GAME_STATE", getGameById(gameId));
    }
  });
});

console.log("listening on port", port);
