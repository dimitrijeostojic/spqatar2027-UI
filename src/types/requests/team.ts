export interface CreateTeamRequest {
    teamName: string;
    flagIcon?: string;
    groupPublicId: string;
}

export interface DeleteTeamRequest {
   publicId: string;
}

export interface GetAllTeamsRequest {
}

export interface GetTeamByIdRequest {
  publicId: string;
}

export interface UpdateTeamRequest {
  teamPublicId?: string;
  teamName: string;
  flagIcon?: string;
    groupPublicId?: string;
}