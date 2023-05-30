import { Role } from '../../common/user-role.constant';

export interface IRegisterNewUser {
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  role: Role;
}
