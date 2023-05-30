
export interface IUserInfo {
  id: number;
  role: string;
  emailVerified: boolean;
  email: string;
  firstName: string;
  lastName: string;
  status: string;
  type: string;
  birthDate?: Date;
}
