import {
  createComment,
  getCommentById,
  getCommentsBySourceId,
  toggleHiddenComments,
} from '../../services/commentServices';
import Comment from '../../comments/Comment';
import Post from '../../posts/Post';
import User from '../../users/User';
import { ErrorREST, Errors } from '../../utilities/ErrorREST';
import mongoose from 'mongoose';
import { mongoURI } from '../../config/db';

describe('commentServices', (): void => {
  beforeAll(
    async (): Promise<void> => {
      mongoose.connect(mongoURI, { useNewUrlParser: true });
      await User.deleteMany({}).exec();
      await Comment.deleteMany({}).exec();
    },
  );
  afterEach(
    async (): Promise<void> => {
      await User.deleteMany({}).exec();
      await Comment.deleteMany({}).exec();
    },
  );
  afterAll(
    async (): Promise<void> => {
      await User.deleteMany({}).exec();
      await Comment.deleteMany({}).exec();
      await mongoose.disconnect();
    },
  );
  const text = 'testText';
  const onModel = 'Post';

  describe('createComment', (): void => {
    const sourceId = mongoose.Types.ObjectId().toString();
    const userId = mongoose.Types.ObjectId().toString();
    it(`should create new comment`, async (): Promise<void> => {
      const commentId = await createComment(text, userId, sourceId, onModel);
      expect(commentId).toBeTruthy();
      const comment = await Comment.findById(commentId);
      if (!comment) {
        return;
      }
      expect(comment.text).toMatch(text);
      expect(comment.onModel).toMatch(onModel);
    });
  });
  describe('getCommentById', (): void => {
    const sourceId = mongoose.Types.ObjectId();
    const userId = mongoose.Types.ObjectId();
    it(`should return a comment`, async (): Promise<void> => {
      const newComment = new Comment({
        text,
        source: sourceId,
        onModel,
        user: userId,
      });
      await newComment.save();
      const { _id } = newComment;

      const comment = await getCommentById(_id);
      if (!comment) {
        return;
      }
      expect(comment.text).toMatch(text);
      expect(comment.onModel).toMatch(onModel);
    });

    it(`shouldn't throw an error if rule isn't found`, async (): Promise<
      void
    > => {
      const id = mongoose.Types.ObjectId().toString();
      const { status, message } = Errors.NotFound;
      const error = new ErrorREST(status, message, null);
      await expect(getCommentById(id)).rejects.toThrow(error);
    });
  });
  describe('getCommentsBySourceId', (): void => {
    const limit = 25;
    const page = 1;
    let userId: string;
    let sourceId: string;
    let secondSourceId: string;
    beforeEach(
      async (): Promise<void> => {
        const email = 'newEmail@mail.com';
        const username = 'username';
        const password = 'password';
        const newUser = new User({
          email,
          password,
          username,
        });
        await newUser.save();
        userId = newUser._id;
        const firstPost = new Post({
          type: 'text',
          title: 'title',
          text: 'text',
          community: mongoose.Types.ObjectId(),
          user: userId,
        });
        await firstPost.save();
        const secondPost = new Post({
          type: 'text',
          title: 'title',
          text: 'text',
          community: mongoose.Types.ObjectId(),
          user: userId,
        });
        await secondPost.save();
        sourceId = firstPost._id;
        secondSourceId = secondPost._id;
      },
    );

    it(`should return a list of comments by upvotes(top)`, async (): Promise<
      void
    > => {
      const sort = 'top';
      const commentsArr = [
        {
          text: 'first',
          onModel: 'Post',
          upvotes: 100,
          comments: 40,
          source: sourceId,
          user: userId,
        },
        {
          text: 'second',
          onModel: 'Post',
          upvotes: 300,
          comments: 20,
          source: sourceId,
          user: userId,
        },
        {
          text: 'third',
          onModel: 'Post',
          upvotes: 200,
          comments: 30,
          source: sourceId,
          user: userId,
        },
        {
          text,
          onModel: 'Post',
          comments: 1,
          source: secondSourceId,
          user: userId,
        },
      ];
      await Comment.insertMany(commentsArr);
      const { comments, commentsCount } = await getCommentsBySourceId(
        sourceId,
        sort,
        limit,
        page,
      );
      if (!comments) {
        return;
      }
      expect(comments).toHaveLength(3);
      expect(comments[0].upvotes).toBe(300);
      expect(comments[1].upvotes).toBe(200);
      expect(comments[2].upvotes).toBe(100);
    });
    it(`should return a list of comments sorted by comments`, async (): Promise<
      void
    > => {
      const sort = 'comments';
      const commentsArr = [
        {
          text: 'first',
          onModel: 'Post',
          upvotes: 100,
          comments: 40,
          source: sourceId,
          user: userId,
        },
        {
          text: 'second',
          onModel: 'Post',
          upvotes: 300,
          comments: 20,
          source: sourceId,
          user: userId,
        },
        {
          text: 'third',
          onModel: 'Post',
          upvotes: 200,
          comments: 30,
          source: sourceId,
          user: userId,
        },
        {
          text,
          onModel: 'Post',
          comments: 1,
          source: secondSourceId,
          user: userId,
        },
      ];
      await Comment.insertMany(commentsArr);
      const { comments, commentsCount } = await getCommentsBySourceId(
        sourceId,
        sort,
        limit,
        page,
      );
      if (!comments) {
        return;
      }
      expect(comments).toHaveLength(3);
      expect(comments[0].comments).toBe(40);
      expect(comments[1].comments).toBe(30);
      expect(comments[2].comments).toBe(20);
    });
    it(`should return a list of comments sorted by new`, async (): Promise<
      void
    > => {
      const sort = 'new';
      const commentsArr = [
        {
          text: 'first',
          onModel: 'Post',
          upvotes: 100,
          comments: 40,
          source: sourceId,
          user: userId,
        },
        {
          text: 'second',
          onModel: 'Post',
          upvotes: 300,
          comments: 20,
          source: sourceId,
          user: userId,
        },
        {
          text: 'third',
          onModel: 'Post',
          upvotes: 200,
          comments: 30,
          source: sourceId,
          user: userId,
        },
        {
          text,
          onModel: 'Post',
          comments: 1,
          source: secondSourceId,
          user: userId,
        },
      ];
      await Comment.insertMany(commentsArr);
      const { comments, commentsCount } = await getCommentsBySourceId(
        sourceId,
        sort,
        limit,
        page,
      );
      if (!comments) {
        return;
      }
      expect(comments).toHaveLength(3);
      expect(comments[0].text).toMatch('first');
      expect(comments[1].text).toMatch('second');
      expect(comments[2].text).toMatch('third');
    });
    it(`shouldn't throw an error if no comments are found`, async (): Promise<
      void
    > => {
      const sort = 'top';
      const { status, message } = Errors.NotFound;
      const error = new ErrorREST(status, message, null);
      await expect(
        getCommentsBySourceId(sourceId, sort, limit, page),
      ).rejects.toThrow(error);
    });
  });
});
