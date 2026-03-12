import { ForfeitSide } from "../enums/enums";

export interface CreateMatchRequest {
  homeTeamPublicId: string;
  awayTeamPublicId: string;
  startTime: string;
  stadiumPublicId: string;
}

export interface ForfeitMatchRequest {
  matchPublicId?: string;
  forfeitLoser?: ForfeitSide;
}

export interface GetAllMatchesRequest {
    groupPublicId?: string;
}

export interface GetMatchByIdRequest {
  matchPublicId: string;
}

export interface RecordMatchResultRequest {
  matchPublicId?: string;
  homePoints: number;
  awayPoints: number;
}