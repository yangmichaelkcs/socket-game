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
  ROUND_REQ
} from "./src/types/types";

const port = 8888;
const io = socketIo.listen(port);

const gamesById: { string?: Game } = {};

function capitalizeFirstLetter(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function getRandomWord() {
  return capitalizeFirstLetter(randomWord());
}

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

function getPlayerCount(gameId) {
  return Object.keys(gamesById[gameId].players).length;
}

const createNewGame = () => {
  const id = getRandomWord() + getRandomWord() + getRandomWord();
  const game = {
    players: [],
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
  const player: Player = {
    socketId: socket.id,
    nickName: `${getRandomWord()}`,
    role: "DETECTIVE USELESS",
    selected: 0,
    team: null
  };
  socket.join(gameId);
  getGameById(gameId).players.push(player);
};

const getPlayerBySocket = socket => {
  const game = getGameBySocket(socket);
  return game.players.find(player => player.socketId === socket.id);
};

const updatePlayerName = (socket, nickName) => {
  const player: Player = getPlayerBySocket(socket);
  player.nickName = nickName;
};

const updatePlayerSelected = (socket, socketId, selected) => {
  const playerSelected = getGameBySocket(socket).players.find(
    player => player.socketId === socketId
  );
  playerSelected.selected = selected;
};

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

const updateRoundStatus = socket => {
  const game: Game = getGameBySocket(socket);
  game.roundStatus = nextRoundStatus(game.roundStatus);
};

const startGame = (gameId: string) => {
  const game: Game = gamesById[gameId];
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

const assignRoles = (gameId: string) => {
   const players: Player[] = gamesById[gameId].players;
   const playerKeys = Object.keys(players);
  // var numBadPlayer = 0;
  // while(numBadPlayer < PLAYER_DISTRIBUTION[players.length].bad) {
  //   let index = Math.floor(Math.random() * (players.length + 1))
  //   if(isNullOrUndefined(players[index].team)) {
  //     players[index].team = TEAM.BAD;
  //     numBadPlayer++;
  //   }
  // }
  // for(var i = 0; i < players.length; i++) { 
  //   if(isNullOrUndefined(players[i].team)) {
  //     players[i].team = TEAM.GOOD;
  //   }
  // }
     playerKeys.forEach(playerId => {
     const player: Player = players[playerId];
     player.team = TEAM.GOOD;
   });
};

const nextPlayerTurn = socket => {
  const game: Game = getGameBySocket(socket);
  const currPlayerIndex = game.players.findIndex(p => p.socketId === game.currentPlayerTurn);
  const nextPlayerIndex = (currPlayerIndex + 1) % game.players.length;
  game.currentPlayerTurn = game.players[nextPlayerIndex].socketId;
}

const updateVote = (socket, vote) => {
  const game: Game = getGameBySocket(socket);
  vote === -1 ? game.votes[VOTE_INDEX.NEG]++ : game.votes[VOTE_INDEX.POS]++;
}

const resetVotes = socket => {
  const game: Game = getGameBySocket(socket);
  game.votes[VOTE_INDEX.POS] = 0;
  game.votes[VOTE_INDEX.NEG] = 0;
}

const resetSelectPlayers = socket => {
  const game: Game = getGameBySocket(socket);
  game.players.forEach(player => player.selected = 0);
}

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

const checkVoteComplete = socket => {
  const game: Game = getGameBySocket(socket);
  if(game.roundStatus == ROUND_STATUS.VOTING_TEAM) {
    if(game.votes[VOTE_INDEX.NEG] + game.votes[VOTE_INDEX.POS] == game.players.length) {
      return true;
    }
  } 
}
const checkMissionVoteComplete = socket => {
  const game: Game = getGameBySocket(socket);
  if(game.votes[VOTE_INDEX.NEG] + game.votes[VOTE_INDEX.POS] == game.rounds[game.currentRound - 1].playersNeeded) {
    return true;
  }
}

//Cant reset failed votes here, need it in propose new team
const checkVoteSucceed = socket => {
  const game: Game = getGameBySocket(socket);
  const voteSucceed =  game.votes[VOTE_INDEX.POS] > game.votes[VOTE_INDEX.NEG] ? true : false;
  resetVotes(socket);
  nextPlayerTurn(socket);
  return voteSucceed;

}

//Want to keep votes to display, think aobut updating score later to do reveal of mission
const checkMissionSucceed = socket => {
  const game: Game = getGameBySocket(socket);
  const numFailNeeded = game.rounds[game.currentRound - 1].failsNeeded;
  return game.votes[VOTE_INDEX.NEG] < numFailNeeded; 
}

const newTeamPropose = socket => {
  const game: Game = getGameBySocket(socket);
  resetSelectPlayers(socket);
  game.failedVotes++;
  game.roundStatus = ROUND_STATUS.PROPOSING_TEAM;
  if(game.failedVotes === 5)
  {
    updateScore(socket, TEAM.BAD);
    resetFailedVotes(socket);
    return false; //Bad team gets point
  }
};

const resetFailedVotes = socket => {
  const game: Game = getGameBySocket(socket);
  game.failedVotes = 0;
}

const checkWinner = socket => {
  const game: Game = getGameBySocket(socket);
  if(game.score[VOTE_INDEX.POS] === 3) {
    return TEAM.GOOD;
  }
  if(game.score[VOTE_INDEX.NEG]) {
    return TEAM.BAD
  }
  return false;
}

const endGame = socket => {
  const game: Game = getGameBySocket(socket);
  game.roundStatus = ROUND_STATUS.MISSION_END;
}

io.on("connection", socket => {
  socket.on("disconnect", function() {
    console.log("user disconnected: " + socket.id);
  });

  // FIXME: This should only UPDATE_COUNT based on game state
  // If game has not started, it should decrement
  // If game has started we need to implement socket reconnection
  socket.on("disconnecting", () => {
    const gameId = getGameIdBySocket(socket);
    if (gameId && gamesById[gameId]) {
      delete gamesById[gameId].players[socket.id];
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
      addPlayerToGame(gameId, socket);

      io.to(gameId).emit("JOINED_GAME", getGameById(gameId));
      socket.emit("SET_SOCKET_ID", socket.id);

      console.log(`${socket.id} joined a game with gameId: ${gameId}`);
    } else {
      console.log(`Game Id ${gameId} does not exist.`);
      // TODO: Add some error handling here
    }
  });

  socket.on("START_GAME", () => {
    const gameId = getGameIdBySocket(socket);
    if (gameId && gamesById[gameId]) {
      assignRoles(gameId);
      startGame(gameId);
      io.to(gameId).emit("GAME_STARTING", getGameById(gameId));
    }
  });

  socket.on("UPDATE_NICKNAME", (nickName: string) => {
    updatePlayerName(socket, nickName);
    const gameId = getGameIdBySocket(socket);
    io.to(gameId).emit("UPDATE_GAME_STATE", getGameById(gameId));
  });

  socket.on("PICK_PLAYER", (socketId: string, selected: number) => {
    updatePlayerSelected(socket, socketId, selected);
    const gameId = getGameIdBySocket(socket);
    io.to(gameId).emit("UPDATE_GAME_STATE", getGameById(gameId));
  });

  socket.on("PROPOSE_TEAM", () => {
    updateRoundStatus(socket);
    const gameId = getGameIdBySocket(socket);
    io.to(gameId).emit("UPDATE_GAME_STATE", getGameById(gameId));
  });

  socket.on("UPDATE_TEAM_VOTE",  async (vote : number) =>  {
    updateVote(socket, vote);
    if(checkVoteComplete(socket)) {
      updateRoundStatus(socket);  //Voting_end
      let gameId = getGameIdBySocket(socket);
      io.to(gameId).emit("UPDATE_GAME_STATE", getGameById(gameId));
      await wait(6000);
      //Team is going on Mission
      if(checkVoteSucceed(socket)) {
        resetFailedVotes(socket);
        updateRoundStatus(socket);  //Mission_inprogress
        gameId = getGameIdBySocket(socket);
        io.to(gameId).emit("UPDATE_GAME_STATE", getGameById(gameId));
      } else { //New Vote
        if(!newTeamPropose(socket)) {
          if(checkWinner(socket) === TEAM.BAD) {
            endGame(socket);
            await wait(20000);
            const game: Game = getGameBySocket(socket);
            game.status = GAME_STATUS.END;
            io.to(gameId).emit("UPDATE_GAME_STATE", getGameById(gameId));
            return;
          }
        }
        gameId = getGameIdBySocket(socket);
        io.to(gameId).emit("UPDATE_GAME_STATE", getGameById(gameId));
      }
    }
  });

  socket.on("UPDATE_MISSION_VOTE",  async (vote : number) =>  {
    updateVote(socket, vote);
    if(checkMissionVoteComplete(socket)) {
      const gameId = getGameIdBySocket(socket);
      const shuffledVotesArr = shuffleVotes(socket);
      resetVotes(socket);
      const game: Game = getGameBySocket(socket);
      for(let i = 0; i < shuffledVotesArr.length; i++) {
        await wait(2000);
        if(shuffledVotesArr[i] === 1) {
          game.votes[VOTE_INDEX.POS]++;
        }
        else {
          game.votes[VOTE_INDEX.NEG]++;
        }
        io.to(gameId).emit("UPDATE_GAME_STATE", getGameById(gameId));
      }
      await wait(3000);
      checkMissionSucceed(socket) ? updateScore(socket, TEAM.GOOD) : updateScore(socket, TEAM.BAD)
      updateRoundStatus(socket);  //Mission_end without round update
      io.to(gameId).emit("UPDATE_GAME_STATE", getGameById(gameId));
      await wait(6000);
      if(checkWinner(socket) !== false) {
        endGame(socket);
        resetVotes(socket);
        io.to(gameId).emit("UPDATE_GAME_STATE", getGameById(gameId));
        await wait(20000);
        game.status = GAME_STATUS.END;
        io.to(gameId).emit("UPDATE_GAME_STATE", getGameById(gameId));
        return;
      }
      resetVotes(socket);
      resetSelectPlayers(socket);
      nextPlayerTurn(socket);
      updateRoundStatus(socket);  //Proposing team
      io.to(gameId).emit("UPDATE_GAME_STATE", getGameById(gameId));
    }
  });

  async function wait(ms) {
    return new Promise(resolve => {
      setTimeout(resolve, ms);
    });
  };

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
});

console.log("listening on port", port);
