import { ForfeitSide, MatchStatus } from "../enums/enums";

export interface Entity {
  id: number;
  publicId: string;
}

export interface Group extends Entity {
  groupName: string;
  teams?: Team[];
}

export interface Team extends Entity {
  teamName: string;
  flagIcon?: string;
  groupId?: number;
  group?: Group;
}

export interface Stadium extends Entity {
  stadiumName: string;
  city: string;
  capacity: number;
  matches?: Match[];
}

export interface Match extends Entity {
  homeTeamId: number;
  awayTeamId: number;
  startTime: string;
  status: MatchStatus;
  stadiumId: number;
  homePoints?: number;
  awayPoints?: number;
  isForfeit: boolean;
  forfeitLoser?: ForfeitSide;
  homeTeam?: Team;
  awayTeam?: Team;
  stadium?: Stadium;
}

export interface TeamStanding {
  teamId: number;
  teamName: string;
  flagIcon?: string;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  pointsFor: number;
  pointsAgainst: number;
  standingPoints: number;
}

export interface GroupStandings {
  groupId: string;
  groupName: string;
  standings: TeamStanding[];
}