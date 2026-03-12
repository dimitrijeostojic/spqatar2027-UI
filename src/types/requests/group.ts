//Group request types
export interface CreateGroupRequest {
  groupName: string;
}

export interface DeleteGroupRequest {
  publicId: string;
}

export interface GetAllGroupsRequest {
}

export interface GetGroupByIdRequest {
  publicId: string;
}

export interface GetGroupStandingsRequest {
  publicId: string;
}

export interface UpdateGroupRequest {
  publicId: string;
  name: string;
}