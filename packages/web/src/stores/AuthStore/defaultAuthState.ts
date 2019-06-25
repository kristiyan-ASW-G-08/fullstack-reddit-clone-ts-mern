import AuthState from '../../types/AuthState';
const defaultAuthState: AuthState = {
  isAuth: false,
  token: '',
  expiryDate: '',
  user: {
    userId: '',
    username: '',
    email: '',
  },
};

export default defaultAuthState;
