import { FaRegUser, FaTimes, FaCheck } from 'react-icons/fa'
import * as React from "react";
import { connect } from "react-redux";
import RoleButton from "./RoleButton";
import VoteButtons from "./VoteButtons";
import AllRounds from "./AllRounds";
import PlayerList from "./PlayerList/PlayerList";
import Legend from "./Legend/Legend";
import {
  getPlayerDataById,
  getCurrentPlayerTurn,
  getPlayers,
  getCurrentRound,
  getPlayerData,
  getFailedVotes,
  getRounds,
  getRoundStatus,
  getVotes,
  getCurrentPage,
  getScore
} from "selectors";
import { Player, ROUND_STATUS, Round, GAME_STATUS, VOTE_INDEX, TEAM } from "types/types";

interface GameState {
  oldVotes: number[];
  voteOrder: string[];
}

interface GameStateProps {
  curentPlayerTurn: Player;
  players: Player[];
  currentRound: number;
  playerData: Player;
  roundStatus: ROUND_STATUS;
  failedVotes: number;
  rounds: Round[];
  votes: number[];
  status: GAME_STATUS;
  score: number[];
}

class Game extends React.Component<GameStateProps, any> {
  constructor(props) {
    super(props);
    this.state = { 
      oldVotes: [0, 0],
      voteOrder: []
    };
  }

  // Returns current players turn to pick and the requirements
  public displayProposingTeam() {
    const { rounds, currentRound, curentPlayerTurn } = this.props;
    const playersNeeded = rounds[currentRound - 1].playersNeeded;
    return (
      <div>
        <h4>Turn to Pick: {curentPlayerTurn.nickName}</h4>
        <p><FaRegUser className="Iconsize"/>Players needed: {playersNeeded} 
        <br/><FaTimes className="Iconsize Fail"/>Fails needed: {rounds[currentRound -1].failsNeeded}</p>
      </div>
    );
  }
  
  // Returns proposed team
  public displayProposedTeam() {
    const { players } = this.props;
    return (
      <div>
        <h4>Vote on the team:</h4>
        <p>{players.filter(player => player.selected).map(p => p.nickName).join(", ")} </p>
      </div>
    );
  }

  // Returns team proposal votes
  public displayProposedTeamResult() {
    const { votes } = this.props;
    return (
      <div>
        <h4>Voting has completed</h4>
        <p>Approved: {votes[VOTE_INDEX.POS]}  Rejected: {votes[VOTE_INDEX.NEG]}</p>
      </div>
    );
  }

  // Returns players on mission
  public displayPlayersOnMission() {
    const { players } = this.props;
    return (
      <div>
        <h4>Players on the mission:</h4>
        <p>{players.filter(player => player.selected).map(p => p.nickName).join(", ")}</p>
      </div>
    );
  }
  
  public displayMissionVotingResults() {
    return (
      <div>
        <h4>Mission has completed</h4>
        <p>{this.state.voteOrder.map((vote, index) => {
           if(vote === TEAM.GOOD) {
            return <FaCheck className="MissionVoteSize Success" key={index}/>;
          } else {
            return <FaTimes className="MissionVoteSize Fail" key={index}/>;
          }})}
        </p>
      </div>
    );
  }

  public showAnnouncment () {
    const { roundStatus, rounds, currentRound, votes, score } = this.props;
    // Start of Round: Proposing Team
    if (roundStatus === ROUND_STATUS.PROPOSING_TEAM) {
      return this.displayProposingTeam();
    }
    // Proposed team: vote on it
    else if (roundStatus === ROUND_STATUS.VOTING_TEAM) {
      return this.displayProposedTeam();
    }
    // Voting on team has ended 
    else if (roundStatus === ROUND_STATUS.VOTING_END) {
      return this.displayProposedTeamResult();
    }
    // Mission in progress
    else if (roundStatus === ROUND_STATUS.MISSION_IN_PROGRESS) {
      // If mission voting has not completed, display players on mission
      if(votes[VOTE_INDEX.POS] + votes[VOTE_INDEX.NEG] === 0) {
        return this.displayPlayersOnMission();
      }
      /* Mission voting has completed, server will update one by one for climatic reveal.
       * This happens by by updating oldVotes every time a new vote comes in from the server
       */
      else {
        if(votes[VOTE_INDEX.POS] === this.state.oldVotes[VOTE_INDEX.POS] && votes[VOTE_INDEX.NEG] === this.state.oldVotes[VOTE_INDEX.NEG]) {
          return this.displayMissionVotingResults();
        }
      }
    } 
    else if (roundStatus === ROUND_STATUS.MISSION_END) {
      if(score[VOTE_INDEX.POS] === 3 || score[VOTE_INDEX.NEG] === 3) {
        const winningTeam = score[VOTE_INDEX.NEG] === 3 ? "Spies" : "Resistance";
        return (
          <div>
            <h4>{winningTeam} WINS</h4>
            <p>Resistance: {score[VOTE_INDEX.POS]}  Spies: {score[VOTE_INDEX.NEG]}</p>
          </div>
        );
      }
      let winner = "";
      votes[VOTE_INDEX.NEG] >= rounds[currentRound - 1].failsNeeded ? winner = "Fails" : winner = "Succeeds"
      return (
        <div>
          <h4>Mission {winner}</h4>
          <p>{this.state.voteOrder.map((vote, index) => {
                if(vote === TEAM.GOOD) {
                  return <FaCheck className="MissionVoteSize Success" key={index}/>;
                } else {
                  return <FaTimes className="MissionVoteSize Fail" key={index}/>;
                }})}
          </p>
        </div>
      ); 
    }
  }

  public componentDidUpdate() {
    const { roundStatus, votes} = this.props;
    if (roundStatus === ROUND_STATUS.PROPOSING_TEAM) {
      if(!(this.state.oldVotes[VOTE_INDEX.POS] === 0 && this.state.oldVotes[VOTE_INDEX.NEG] === 0 && this.state.voteOrder.length === 0)) {
        this.setState({oldVotes: [0,0], voteOrder: []});
      }
    } else if (roundStatus === ROUND_STATUS.MISSION_IN_PROGRESS) {
      if(!(votes[VOTE_INDEX.POS] + votes[VOTE_INDEX.NEG] === 0)) {
        if(!(votes[VOTE_INDEX.POS] === this.state.oldVotes[VOTE_INDEX.POS] && votes[VOTE_INDEX.NEG] === this.state.oldVotes[VOTE_INDEX.NEG])) {
          if(votes[VOTE_INDEX.POS] === this.state.oldVotes[VOTE_INDEX.POS]) {
            this.setState({voteOrder: [...this.state.voteOrder, TEAM.BAD]})
          }
          else {
            this.setState({voteOrder: [...this.state.voteOrder, TEAM.GOOD]})
          }
          this.setState({oldVotes: votes})
        }
      }
    }
  }

  public render() {
    const {
      players,
      currentRound,
      rounds,
      roundStatus,
      failedVotes
    } = this.props;
    return (
      <div className="Game">
        <RoleButton />
        <div style={{minHeight:"85px"}}>{this.showAnnouncment()}</div>
        <AllRounds rounds={rounds} failedVotes={failedVotes} currentRound={currentRound} />
        <div style={{minHeight:"226px"}}>
        <PlayerList/>
        <VoteButtons roundStatus={roundStatus} players = {players}/>
        </div>
        <Legend/>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const curentPlayerTurn: Player = getPlayerDataById(
    state,
    getCurrentPlayerTurn(state)
  );
  const players: Player[] = getPlayers(state);
  const currentRound: number = getCurrentRound(state);
  const playerData: Player = getPlayerData(state);

  return {
    curentPlayerTurn,
    players,
    currentRound,
    playerData,
    failedVotes: getFailedVotes(state),
    rounds: getRounds(state),
    roundStatus: getRoundStatus(state),
    votes: getVotes(state),
    status: getCurrentPage(state),
    score: getScore(state)
  };
};

export default connect(mapStateToProps)(Game);
