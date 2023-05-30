export enum ActionType {
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  CREATE = 'CREATE',
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  RESET_PASSWORD = 'RESET_PASSWORD',
  VERIFY = 'VERIFY',
  SET_ACTIVATION = 'SET_ACTIVATION',
}

export type Activity = {
  sentAt?: Date;
  responseTime: number;
  user?: {
    id: number;
    role: string;
    avatar?: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  request?: {
    uid: string;
    method: string;
    url: string;
    body: Record<string, any>;
    param: Record<string, any>;
    query: Record<string, any>;
  };
  response?: {
    payload: Record<string, any>;
    meta: Record<string, any>;
  };
  entity?: ActivityEntity;
  action?: ActivityAction;
};
export type ActivityEntity = {
  name: string;
  id?: number;
};
export type ActivityAction = { type: ActionType; info?: Record<string, any> };

export type InnerActivity = {
  entity?: ActivityEntity;
  action?: ActivityAction;
};
