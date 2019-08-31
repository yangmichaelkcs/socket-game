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
  getScore,
  getIncludes
} from "../../selectors";
import { Player, ROUND_STATUS, Round, GAME_STATUS, VOTE_INDEX, TEAM, SCORE_TYPE } from "../../types/types";

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
  includes: boolean[];
}

// Initial state so we can reset to this
const initialState = {
  oldVotes: [0, 0],
  voteOrder: []
};

class Game extends React.Component<GameStateProps, any> {
  constructor(props) {
    super(props);
    this.state = initialState
  }

  // Returns current players turn to pick and the requirements
  public displayProposingTeam() {
    const { rounds, currentRound, curentPlayerTurn } = this.props;
    const playersNeeded = rounds[currentRound - 1].playersNeeded;
    return (
      <div>
        <h4>Turn to Pick: {curentPlayerTurn.nickName.toString()}</h4>
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
        <p>{players.filter(player => player.selected).map(p => p.nickName.toString()).join(", ")} </p>
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
        <p>{players.filter(player => player.selected).map(p => p.nickName.toString()).join(", ")}</p>
      </div>
    );
  }
  
  // Returns mission voting results based on server shuffled order
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

  // Returns the winner of the game
  public displayWinner() {
    const { score } = this.props;
    const winningTeam = score[VOTE_INDEX.NEG] === 3 ? "Minions" : "Knights";
    return (
      <div>
        <h4>{winningTeam} Win!</h4>
        <p>Knights: {score[VOTE_INDEX.POS]}  Minions: {score[VOTE_INDEX.NEG]}</p>
      </div>
    );
  }

  // Returns the mission results based on number of fails needed for that round
  public displayMissionResults() {
    const { rounds, currentRound, votes } = this.props;
    const winner = votes[VOTE_INDEX.NEG] >= rounds[currentRound - 1].failsNeeded ?  "Fails" : "Succeeds"
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

  public displayAssassinChoose() {
    return (
      <div>
        <h4>One last chance for evil...</h4>
        <p>Assassin select Merlin to kill</p>
      </div>
    );
  }

  public displayMerlinPicked() {
    const { score } = this.props
    if(score[VOTE_INDEX.NEG] === SCORE_TYPE.ASSASSIN) {
      return (
        <div>
          <h4>Merlin is killed!</h4>
          <p>Minions win!</p>
        </div>
      ); 
    }
    return (
      <div>
        <h4>Merlin is safe!</h4>
        <p>Knights win!</p>
      </div>
    );
  }

  public showAnnouncment () {
    const { roundStatus, votes, score } = this.props;
    switch(roundStatus) {
      // Start of Round: Proposing Team
      case ROUND_STATUS.PROPOSING_TEAM:
        return this.displayProposingTeam();
      // Proposed team: vote on it
      case ROUND_STATUS.VOTING_TEAM:
        return this.displayProposedTeam();
      // Voting on team has ended 
      case ROUND_STATUS.VOTING_END:
        return this.displayProposedTeamResult();
      // Mission in progress
      case ROUND_STATUS.MISSION_IN_PROGRESS:
        // If mission voting has not completed, display players on mission
        if(votes[VOTE_INDEX.POS] + votes[VOTE_INDEX.NEG] === 0) {
          return this.displayPlayersOnMission();
        }
        /* Mission voting has completed, server will update one by one for climatic reveal.
         * This happens by by updating oldVotes every time a new vote comes in from the server
         */
          return this.displayMissionVotingResults();
      // Mission End
      case ROUND_STATUS.MISSION_END:
        // A team has won the game
        if(score[VOTE_INDEX.POS] === 3 || score[VOTE_INDEX.NEG] === 3) {
          return this.displayWinner();
        }
        // Game still going
        return this.displayMissionResults()
      // Assassination Round
      case ROUND_STATUS.ASSASSIN_CHOOSE:
        return this.displayAssassinChoose();
      // Merlin Picked
      case ROUND_STATUS.MERLIN_PICKED:
        return this.displayMerlinPicked();
    }
  }

  // Returns true if current state is same as initial state
  public checkInitialState() {
    return this.state.oldVotes[VOTE_INDEX.POS] === 0 && this.state.oldVotes[VOTE_INDEX.NEG] === 0 && this.state.voteOrder.length === 0;
  }

  // Returns true if no votes updated from server
  public noVoteRecv() {
    const { votes} = this.props;
    return votes[VOTE_INDEX.POS] + votes[VOTE_INDEX.NEG] === 0;
  }

  // Returns true if this state and props have the same votes
  public votesSame() {
    const { votes} = this.props;
    return votes[VOTE_INDEX.POS] === this.state.oldVotes[VOTE_INDEX.POS] && votes[VOTE_INDEX.NEG] === this.state.oldVotes[VOTE_INDEX.NEG];
  }

  // On component update this will set correct states to show mission voting 
  public componentDidUpdate() {
    const { roundStatus, votes} = this.props;
    // Before counting votes for mission want to reset the state
    if (roundStatus === ROUND_STATUS.VOTING_END) {
      // If not initial state then reset it
      if(!(this.checkInitialState())) {
        this.setState(initialState);
      }
    } 
    // Showing votes one at a time
    else if (roundStatus === ROUND_STATUS.MISSION_IN_PROGRESS) {
      if(!(this.noVoteRecv()) && !(this.votesSame())) {
          // There is updated vote and must be failed vote
          if(votes[VOTE_INDEX.POS] === this.state.oldVotes[VOTE_INDEX.POS]) {
            this.setState({voteOrder: [...this.state.voteOrder, TEAM.BAD]})
          }
          // There is updated vote and must be success vote
          else {
            this.setState({voteOrder: [...this.state.voteOrder, TEAM.GOOD]})
          }
          // Set old votes to compare to updated votes from server
          this.setState({oldVotes: votes})
      }
    }
  }
  

  public render() {
    const { players, currentRound, rounds, roundStatus, failedVotes } = this.props;
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
    score: getScore(state),
    includes: getIncludes(state)
  };
};

export default connect(mapStateToProps)(Game);
