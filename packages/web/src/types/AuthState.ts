import User from './User';
export default interface AuthState {
  isAuth: boolean;
  token: string;
  expiryDate: string;
  user: User;
}
