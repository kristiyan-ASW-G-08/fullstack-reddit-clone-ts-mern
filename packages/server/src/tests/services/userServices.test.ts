import {
  upvotePost,
  downvotePost,
  upvoteComment,
  downvoteComment,
  createUser,
  getUserByEmail,
  getUserById,
  authenticateUser,
  subscribe,
} from '../../services/userServices';
import User from '../../users/User';
import UserType from '../../types/User';
import { ErrorREST, Errors } from '../../utilities/ErrorREST';
import mongoose from 'mongoose';
import { mongoURI } from '../../config/db';
import bcrypt from 'bcryptjs';
import Post from '../../posts/Post';
import Comment from '../../comments/Comment';
describe('userServices', (): void => {
  beforeAll(
    async (): Promise<void> => {
      mongoose.connect(mongoURI, { useNewUrlParser: true });
      await User.deleteMany({}).exec();
    },
  );
  beforeEach(
    async (): Promise<void> => {
      await User.deleteMany({});
    },
  );
  afterEach(
    async (): Promise<void> => {
      await User.deleteMany({}).exec();
    },
  );
  afterAll(
    async (): Promise<void> => {
      await User.deleteMany({}).exec();
      await mongoose.disconnect();
    },
  );
  const email = 'newEmail@mail.com';
  const username = 'username';
  const password = 'password';
  describe('createUser', (): void => {
    it(`should create new user`, async (): Promise<void> => {
      const userId = await createUser(email, username, password);
      expect(userId).toBeTruthy();
      const user = await User.findById(userId);
      if (!user) {
        return;
      }
      expect(user.email).toMatch(email);
      expect(user.username).toMatch(username);
    });
  });
  describe('getUserByEmail', (): void => {
    it(`should return a user`, async (): Promise<void> => {
      const newUser = new User({
        email,
        password,
        username,
      });
      await newUser.save();
      const user = await getUserByEmail(email);
      if (!user) {
        return;
      }
      expect(user.email).toMatch(email);
      expect(user.username).toMatch(username);
    });

    it(`should throw an error if user isn't found`, async (): Promise<void> => {
      const email = 'newEmail@mail.com';
      const { status, message } = Errors.NotFound;
      const error = new ErrorREST(status, message, null);
      await expect(getUserByEmail(email)).rejects.toThrow(error);
    });
  });
  describe('getUserById', (): void => {
    it(`should return a user`, async (): Promise<void> => {
      const newUser = new User({
        email,
        password,
        username,
      });
      await newUser.save();
      const { _id } = newUser;

      const user = await getUserById(_id);
      if (!user) {
        return;
      }
      expect(user.email).toMatch(email);
      expect(user.username).toMatch(username);
    });

    it(`shouldn't throw an error if user isn't found`, async (): Promise<
      void
    > => {
      const id = mongoose.Types.ObjectId().toString();
      const { status, message } = Errors.NotFound;
      const error = new ErrorREST(status, message, null);
      await expect(getUserById(id)).rejects.toThrow(error);
    });
  });
  describe('getUserByEmail', (): void => {
    it(`should return a user`, async (): Promise<void> => {
      const newUser = new User({
        email,
        password,
        username,
      });
      await newUser.save();
      const user = await getUserByEmail(email);
      if (!user) {
        return;
      }
      expect(user.email).toMatch(email);
      expect(user.username).toMatch(username);
    });

    it(`shouldn't throw an error if user isn't found`, async (): Promise<
      void
    > => {
      const email = 'newEmail@mail.com';
      const { status, message } = Errors.NotFound;
      const error = new ErrorREST(status, message, null);
      await expect(getUserByEmail(email)).rejects.toThrow(error);
    });
  });
  describe('authenticateUser', (): void => {
    let newUser: UserType;
    let email: string;
    let password: string;
    let username: string;
    beforeEach(
      async (): Promise<void> => {
        email = 'newEmail@mail.com';
        username = 'username';
        password = 'password';
        const hashedPassword = await bcrypt.hash(password, 12);
        newUser = new User({
          email,
          password: hashedPassword,
          username,
        });
        newUser.confirmed = true;
        await newUser.save();
      },
    );
    it(`should return a token and userData`, async (): Promise<void> => {
      const { token, userData } = await authenticateUser(newUser, password);
      expect(token).toBeTruthy();
      expect(typeof token).toMatch('string');
      expect(userData.username).toMatch(username);
      expect(userData.email).toMatch(email);
      expect(userData.userId).toMatch(newUser._id.toString());
    });
    it(`shouldn't throw an error if the passwords don't match`, async (): Promise<
      void
    > => {
      const wrongPassword = 'wrong';
      const { status, message } = Errors.Unauthorized;
      const error = new ErrorREST(status, message, null);
      await expect(authenticateUser(newUser, wrongPassword)).rejects.toThrow(
        error,
      );
    });
  });
  describe('upvotePost', (): void => {
    let userId: string;
    let postId: string;
    beforeEach(
      async (): Promise<void> => {
        const email = 'newEmail@mail.com';
        const username = 'username';
        const password = 'password';
        const title = 'testName';
        const text = 'Lorem ipsum dolor sit amet, consectetur';
        const hashedPassword = await bcrypt.hash(password, 12);
        const user = new User({
          email,
          password: hashedPassword,
          username,
        });
        user.confirmed = true;
        await user.save();
        userId = user._id;
        const post = new Post({
          type: 'text',
          title,
          text,
          community: mongoose.Types.ObjectId(),
          user: mongoose.Types.ObjectId(),
        });
        await post.save();
        postId = post._id;
      },
    );
    it(`should add postId to user's upvotedPosts property, and increment  the upvotes of  post by 1`, async (): Promise<
      void
    > => {
      const post = await Post.findById(postId);
      if (!post) {
        throw '';
      }
      const user = await User.findById(userId);
      if (!user) {
        throw '';
      }
      expect(user.upvotedPosts).toHaveLength(0);
      expect(post.upvotes).toBe(0);
      await upvotePost(user, postId, post);
      expect(user.upvotedPosts).toHaveLength(1);
      expect(post.upvotes).toBe(1);
    });
    it(`should remove postId from user's upvotedPosts property, and decrement  the upvotes of  post by 1`, async (): Promise<
      void
    > => {
      const post = await Post.findById(postId);
      if (!post) {
        throw '';
      }
      post.upvotes++;
      await post.save();
      const user = await User.findById(userId);
      if (!user) {
        throw '';
      }
      user.upvotedPosts.push(postId);
      await post.save();
      expect(user.upvotedPosts).toHaveLength(1);
      expect(post.upvotes).toBe(1);
      await upvotePost(user, postId, post);
      expect(user.upvotedPosts).toHaveLength(0);
      expect(post.upvotes).toBe(0);
    });
    it(`should remove postId from user's downvotedPosts property, and add to user's upvotedPosts  and decrement  the downvotes of  post  by 1, but increase it's upvotes by 1`, async (): Promise<
      void
    > => {
      const post = await Post.findById(postId);
      if (!post) {
        throw '';
      }
      post.downvotes++;
      await post.save();
      const user = await User.findById(userId);
      if (!user) {
        throw '';
      }
      user.downvotedPosts.push(postId);
      await post.save();
      expect(user.downvotedPosts).toHaveLength(1);
      expect(post.downvotes).toBe(1);
      await upvotePost(user, postId, post);
      expect(user.downvotedPosts).toHaveLength(0);
      expect(post.downvotes).toBe(0);
      expect(user.upvotedPosts).toHaveLength(1);
      expect(post.upvotes).toBe(1);
    });
  });

  describe('downvotePost', (): void => {
    let userId: string;
    let postId: string;
    beforeEach(
      async (): Promise<void> => {
        const email = 'newEmail@mail.com';
        const username = 'username';
        const password = 'password';
        const title = 'testName';
        const text = 'Lorem ipsum dolor sit amet, consectetur';
        const hashedPassword = await bcrypt.hash(password, 12);
        const user = new User({
          email,
          password: hashedPassword,
          username,
        });
        user.confirmed = true;
        await user.save();
        userId = user._id;
        const post = new Post({
          type: 'text',
          title,
          text,
          community: mongoose.Types.ObjectId(),
          user: mongoose.Types.ObjectId(),
        });
        await post.save();
        postId = post._id;
      },
    );
    it(`should add postId to user's downvotedPosts property, and increment the downvotes of  post by 1`, async (): Promise<
      void
    > => {
      const post = await Post.findById(postId);
      if (!post) {
        throw '';
      }
      const user = await User.findById(userId);
      if (!user) {
        throw '';
      }
      expect(user.downvotedPosts).toHaveLength(0);
      expect(post.downvotes).toBe(0);
      await downvotePost(user, postId, post);
      expect(user.downvotedPosts).toHaveLength(1);
      expect(post.downvotes).toBe(1);
    });
    it(`should remove postId from user's downvotedPosts property, and decrement the downvotes of post by 1`, async (): Promise<
      void
    > => {
      const post = await Post.findById(postId);
      if (!post) {
        throw '';
      }
      post.downvotes++;
      await post.save();
      const user = await User.findById(userId);
      if (!user) {
        throw '';
      }
      user.downvotedPosts.push(postId);
      await post.save();
      expect(user.downvotedPosts).toHaveLength(1);
      expect(post.downvotes).toBe(1);
      await downvotePost(user, postId, post);
      expect(user.downvotedPosts).toHaveLength(0);
      expect(post.downvotes).toBe(0);
    });
    it(`should remove postId from user's upvotedPosts property, and add to user's downvotedPosts, and decrement the upvotes of of by 1 and increase it's downvotes by 1`, async (): Promise<
      void
    > => {
      const post = await Post.findById(postId);
      if (!post) {
        throw '';
      }
      post.upvotes++;
      await post.save();
      const user = await User.findById(userId);
      if (!user) {
        throw '';
      }
      user.upvotedPosts.push(postId);
      await post.save();
      expect(user.upvotedPosts).toHaveLength(1);
      expect(post.upvotes).toBe(1);
      await downvotePost(user, postId, post);
      expect(user.upvotedPosts).toHaveLength(0);
      expect(post.upvotes).toBe(0);
      expect(user.downvotedPosts).toHaveLength(1);
      expect(post.downvotes).toBe(1);
    });
  });
  describe('upvoteComment', (): void => {
    let userId: string;
    let commentId: string;
    beforeEach(
      async (): Promise<void> => {
        const email = 'newEmail@mail.com';
        const username = 'username';
        const password = 'password';
        const text = 'Lorem ipsum dolor sit amet, consectetur';
        const hashedPassword = await bcrypt.hash(password, 12);
        const user = new User({
          email,
          password: hashedPassword,
          username,
        });
        user.confirmed = true;
        await user.save();
        userId = user._id;
        const comment = new Comment({
          text,
          source: mongoose.Types.ObjectId(),
          onModel: 'Post',
          user: mongoose.Types.ObjectId(),
        });
        await comment.save();
        commentId = comment._id;
      },
    );
    it(`should add commentId to user's upvotedComments property, and  increment the upvotes of a comment by 1`, async (): Promise<
      void
    > => {
      const comment = await Comment.findById(commentId);
      if (!comment) {
        throw '';
      }
      const user = await User.findById(userId);
      if (!user) {
        throw '';
      }
      expect(user.upvotedComments).toHaveLength(0);
      expect(comment.upvotes).toBe(0);
      await upvoteComment(user, commentId, comment);
      expect(user.upvotedComments).toHaveLength(1);
      expect(comment.upvotes).toBe(1);
    });
    it(`should remove commentId from user's upvotedComments property, and  decrement the upvotes of a comment by 1`, async (): Promise<
      void
    > => {
      const comment = await Comment.findById(commentId);
      if (!comment) {
        throw '';
      }
      comment.upvotes++;
      await comment.save();
      const user = await User.findById(userId);
      if (!user) {
        throw '';
      }
      user.upvotedComments.push(commentId);
      await comment.save();
      expect(user.upvotedComments).toHaveLength(1);
      expect(comment.upvotes).toBe(1);
      await upvoteComment(user, commentId, comment);
      expect(user.upvotedComments).toHaveLength(0);
      expect(comment.upvotes).toBe(0);
    });
    it(`should remove commentId from user's downvotedComments property,and  add to user's upvotedComments, and decrement the downvotes by 1, but increase it's upvotes by 1`, async (): Promise<
      void
    > => {
      const comment = await Comment.findById(commentId);
      if (!comment) {
        throw '';
      }
      comment.downvotes++;
      await comment.save();
      const user = await User.findById(userId);
      if (!user) {
        throw '';
      }
      user.downvotedComments.push(commentId);
      await comment.save();
      expect(user.downvotedComments).toHaveLength(1);
      expect(comment.downvotes).toBe(1);
      await upvoteComment(user, commentId, comment);
      expect(user.downvotedComments).toHaveLength(0);
      expect(comment.downvotes).toBe(0);
      expect(user.upvotedComments).toHaveLength(1);
      expect(comment.upvotes).toBe(1);
    });
  });

  describe('downvoteComment', (): void => {
    let userId: string;
    let commentId: string;
    beforeEach(
      async (): Promise<void> => {
        const email = 'newEmail@mail.com';
        const username = 'username';
        const password = 'password';
        const text = 'Lorem ipsum dolor sit amet, consectetur';
        const hashedPassword = await bcrypt.hash(password, 12);
        const user = new User({
          email,
          password: hashedPassword,
          username,
        });
        user.confirmed = true;
        await user.save();
        userId = user._id;
        const comment = new Comment({
          text,
          source: mongoose.Types.ObjectId(),
          onModel: 'Post',
          user: mongoose.Types.ObjectId(),
        });
        await comment.save();
        commentId = comment._id;
      },
    );
    it(`should add commentId to user's downvotedComments property, and increment the downvotes of comment by 1`, async (): Promise<
      void
    > => {
      const comment = await Comment.findById(commentId);
      if (!comment) {
        throw '';
      }
      const user = await User.findById(userId);
      if (!user) {
        throw '';
      }
      expect(user.downvotedComments).toHaveLength(0);
      expect(comment.downvotes).toBe(0);
      await downvoteComment(user, commentId, comment);
      expect(user.downvotedComments).toHaveLength(1);
      expect(comment.downvotes).toBe(1);
    });
    it(`should remove commentId from user's downvotedComments property, and decrement the downvotes of comment by 1`, async (): Promise<
      void
    > => {
      const comment = await Comment.findById(commentId);
      if (!comment) {
        throw '';
      }
      comment.downvotes++;
      await comment.save();
      const user = await User.findById(userId);
      if (!user) {
        throw '';
      }
      user.downvotedComments.push(commentId);
      await comment.save();
      expect(user.downvotedComments).toHaveLength(1);
      expect(comment.downvotes).toBe(1);
      await downvoteComment(user, commentId, comment);
      expect(user.downvotedComments).toHaveLength(0);
      expect(comment.downvotes).toBe(0);
    });
    it(`should remove commentId from user's upvotedComments property, and add to user's downvotedComments, and decrement the upvotes of comment by 1, but increase it's downvotes by 1`, async (): Promise<
      void
    > => {
      const comment = await Comment.findById(commentId);
      if (!comment) {
        throw '';
      }
      comment.upvotes++;
      await comment.save();
      const user = await User.findById(userId);
      if (!user) {
        throw '';
      }
      user.upvotedComments.push(commentId);
      await comment.save();
      expect(user.upvotedComments).toHaveLength(1);
      expect(comment.upvotes).toBe(1);
      await downvoteComment(user, commentId, comment);
      expect(user.upvotedComments).toHaveLength(0);
      expect(comment.upvotes).toBe(0);
      expect(user.downvotedComments).toHaveLength(1);
      expect(comment.downvotes).toBe(1);
    });
  });
  describe('subscribe', (): void => {
    let user: UserType;
    beforeEach(
      async (): Promise<void> => {
        const email = 'newEmail@mail.com';
        const username = 'username';
        const password = 'password';
        const hashedPassword = await bcrypt.hash(password, 12);
        user = new User({
          email,
          password: hashedPassword,
          username,
        });
        user.confirmed = true;
        await user.save();
      },
    );
    it(`should add communityId to the communities property of user`, async (): Promise<
      void
    > => {
      expect(user.communities).toHaveLength(0);
      const communityId = mongoose.Types.ObjectId().toString();
      await subscribe(user, communityId);
      expect(user.communities).toHaveLength(1);
      expect(user.communities[0].toString()).toMatch(communityId);
    });

    it(`should remove communityId from the communities property of user`, async (): Promise<
      void
    > => {
      expect(user.communities).toHaveLength(0);
      const communityId = mongoose.Types.ObjectId().toString();
      user.communities.push(communityId);
      await user.save();
      expect(user.communities).toHaveLength(1);
      expect(user.communities[0].toString()).toMatch(communityId);
      await subscribe(user, communityId);
      expect(user.communities).toHaveLength(0);
    });
  });
});
