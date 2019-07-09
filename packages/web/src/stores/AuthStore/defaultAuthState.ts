import AuthState from '../../types/AuthState';
const defaultAuthState: AuthState = {
  isAuth: false,
  token: '',
  expiryDate: '',
  user: {
    avatar: '',
    userId: '',
    username: '',
    email: '',
    savedPosts: [],
    savedComments: [],
    upvotedPosts: [],
    downvotedPosts: [],
    upvotedComments: [],
    downvotedComments: [],
    communities: [],
  },
};

export default defaultAuthState;
