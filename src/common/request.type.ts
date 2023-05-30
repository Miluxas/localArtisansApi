import { IUserInfo } from '../auth/interfaces';

export type RequestType = {
  user: IUserInfo;
  isMobileApp: boolean;
};
