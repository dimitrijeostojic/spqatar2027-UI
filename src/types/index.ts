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
}

export type MatchStatus = 'Scheduled' | 'Completed' | 'Cancelled';
export type ForfeitSide = 'Home' | 'Away';

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

// Request types
export interface CreateGroupRequest {
  groupName: string;
}

export interface UpdateGroupRequest {
  publicId: string;
  name: string;
}

export interface CreateTeamRequest {
  teamName: string;
  flagIcon?: string;
  groupPublicId: string;
}

export interface UpdateTeamRequest {
  teamName?: string;
  flagIcon?: string;
  groupPublicId?: string;
}

export interface CreateMatchRequest {
  homeTeamPublicId: string;
  awayTeamPublicId: string;
  startTime: string;
  stadiumPublicId: string;
}

export interface RecordResultRequest {
  homePoints: number;
  awayPoints: number;
}

export interface ForfeitMatchRequest {
  forfeitLoser: ForfeitSide;
}

export interface GetMatchesQuery {
  groupPublicId?: string;
  teamPublicId?: string;
  status?: MatchStatus;
}
