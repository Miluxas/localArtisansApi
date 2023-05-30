import { IdentityType } from '../../identity/identity-type.constant';

export interface IUserFullInfo {
  id: number;
  role: string;
  emailVerified: boolean;
  email: string;
  firstName: string;
  lastName: string;
  status: string;
  type: IdentityType;
  createdAt: Date;
  educations?: any[];
  experiences?: any[];
  skills?: any[];
  languages?: any[];
  linkedAccounts?: any[];
  financialAccounts?: any[];
}
