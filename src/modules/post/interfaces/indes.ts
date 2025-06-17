import { IUserResponse } from '../../user/interfaces';

export interface IPostResponse {
  id: string;
  post: string;
  userEntity?: IUserResponse;
  createdAt: Date;
  updatedAt: Date;
}
