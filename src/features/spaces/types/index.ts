export type SpaceType = "DESK" | "MEETING_ROOM" | "PRIVATE_OFFICE" | "BOOTH";

export interface Space {
  id: string;
  name: string;
  description: string;
  type: SpaceType;
  pricePerHour: number;
  imageUrl: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSpaceInput {
  name: string;
  description: string;
  type: SpaceType;
  pricePerHour: number;
  imageUrl: string;
}

export interface UpdateSpaceInput extends Partial<CreateSpaceInput> {
  isActive?: boolean;
}

export interface SpacesResponse<T = Space[]> {
  success: boolean;
  data?: T;
  error?: string;
}
