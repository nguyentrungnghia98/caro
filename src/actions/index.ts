import * as TYPES from './types';
import user from '../apis/user';
import { DataAlert } from './alert';

export interface User {
  name: string;
  email: string;
  token?: string;
}

export interface FormValueLogin {
  name?: string;
  email: string;
  password: string;
}

export interface ActionLogin {
  type: string;
  user: User;
  error?: any;
}

export interface ResponseLogin {
  name: string;
  email: string;
  token: string;
}

export interface ActionAlert {
  type: string;
  data: DataAlert;
}

export interface Action {
  type: string;
  payload?: any;
}
