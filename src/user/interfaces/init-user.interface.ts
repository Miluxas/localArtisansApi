export interface IInitUser {
  firstName?: string;
  lastName?: string;
  birthDate?: Date;
  bio?: string;
  mediaId?: number;
  cityId?: number;
  skills?: { levelId: number; value: string }[];
  languages?: { levelId: number; value: number }[];
  accountNumber?: string;
}
