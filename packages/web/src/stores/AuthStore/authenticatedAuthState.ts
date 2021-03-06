import AuthState from '../../types/AuthState';
const authenticatedAuthState: AuthState = {
  isAuth: true,
  token: 'testToken',
  expiryDate: 'date',
  user: {
    avatar: 'avatar',
    userId: '10',
    username: 'testUser',
    email: 'testEmail@mail.com',
    savedPosts: [],
    savedComments: [],
    upvotedPosts: [],
    downvotedPosts: [],
    upvotedComments: [],
    downvotedComments: [],
    communities: [],
  },
};

export default authenticatedAuthState;
