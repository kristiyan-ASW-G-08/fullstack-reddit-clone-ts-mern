import {
  createPost,
  getPostById,
  getPostsByCommunityId,
} from '../../services/postServices';
import Post from '../../models/Post';
import { ErrorREST, Errors } from '../../classes/ErrorREST';
import mongoose from 'mongoose';
import { mongoURI } from '../../config/db';
describe('postServices', (): void => {
  beforeAll(
    async (): Promise<void> => {
      mongoose.connect(mongoURI, { useNewUrlParser: true });
      await Post.deleteMany({}).exec();
    },
  );
  beforeEach(
    async (): Promise<void> => {
      await Post.deleteMany({});
    },
  );
  afterEach(
    async (): Promise<void> => {
      await Post.deleteMany({}).exec();
    },
  );
  afterAll(
    async (): Promise<void> => {
      await Post.deleteMany({}).exec();
      await mongoose.disconnect();
    },
  );
  const title = 'testName';
  const text = 'Lorem ipsum dolor sit amet, consectetur';
  const userId = mongoose.Types.ObjectId().toString();
  const communityId = mongoose.Types.ObjectId().toString();
  describe('createPost', (): void => {
    it(`should create a new text post`, async (): Promise<void> => {
      const type = 'text';
      const content = text;
      const postId = await createPost(
        type,
        title,
        content,
        communityId,
        userId,
      );
      expect(postId).toBeTruthy();
      const post = await Post.findById(postId);
      if (!post) {
        return;
      }
      expect(post.type).toMatch(type);
      expect(post.title).toMatch(title);
      expect(post.text).toMatch(content);
    });
    it('should create a new link post', async (): Promise<void> => {
      const type = 'link';
      const content = 'https://test.com';
      const postId = await createPost(
        type,
        title,
        content,
        communityId,
        userId,
      );
      expect(postId).toBeTruthy();
      const post = await Post.findById(postId);
      if (!post) {
        return;
      }
      expect(post.type).toMatch(type);
      expect(post.title).toMatch(title);
      expect(post.linkUrl).toMatch(content);
    });
    it('should create a new link post', async (): Promise<void> => {
      const type = 'image';
      const content = '/test.svg';
      const postId = await createPost(
        type,
        title,
        content,
        communityId,
        userId,
      );
      expect(postId).toBeTruthy();
      const post = await Post.findById(postId);
      if (!post) {
        return;
      }
      expect(post.type).toMatch(type);
      expect(post.title).toMatch(title);
      expect(post.image).toMatch(content);
    });
  });
  describe('getPostById', (): void => {
    it(`should return a post`, async (): Promise<void> => {
      const type = 'text';
      const newPost = new Post({
        type,
        title,
        text,
        community: communityId,
        user: userId,
      });
      await newPost.save();
      const { _id } = newPost;

      const post = await getPostById(_id);
      if (!post) {
        return;
      }
      expect(post.title).toMatch(title);
      expect(post.text).toMatch(text);
      expect(post.type).toMatch(type);
    });

    it(`shouldn't throw an error if post isn't found`, async (): Promise<
      void
    > => {
      const id = mongoose.Types.ObjectId().toString();
      const { status, message } = Errors.NotFound;
      const error = new ErrorREST(status, message, null);
      await expect(getPostById(id)).rejects.toThrow(error);
    });
  });
  describe('getPostsByCommunityId', (): void => {
    const limit = 25;
    const page = 1;
    const type = 'text';
    it(`should return a list of posts by upvotes(top)`, async (): Promise<
      void
    > => {
      const sort = 'top';
      const secondCommunityId = mongoose.Types.ObjectId().toString();
      const postsArr = [
        {
          title,
          type,
          text,
          upvotes: 100,
          community: communityId,
          user: userId,
        },
        {
          title,
          type,
          text,
          upvotes: 300,
          community: communityId,
          user: userId,
        },
        {
          title,
          type,
          text,
          upvotes: 200,
          community: communityId,
          user: userId,
        },
        {
          title,
          type,
          text,
          community: secondCommunityId,
          user: userId,
        },
      ];

      await Post.insertMany(postsArr);
      const { posts, postsCount } = await getPostsByCommunityId(
        communityId,
        sort,
        limit,
        page,
      );
      if (!posts) {
        return;
      }
      expect(posts).toHaveLength(3);
      expect(posts[0].upvotes).toBe(300);
      expect(posts[1].upvotes).toBe(200);
      expect(posts[2].upvotes).toBe(100);
    });
    it(`should return a list of posts sorted by comments`, async (): Promise<
      void
    > => {
      const sort = 'comments';
      const secondCommunityId = mongoose.Types.ObjectId().toString();
      const postsArr = [
        {
          title,
          type,
          text,
          comments: 40,
          community: communityId,
          user: userId,
        },
        {
          title,
          type,
          text,
          comments: 20,
          community: communityId,
          user: userId,
        },
        {
          title,
          type,
          text,
          comments: 30,
          community: communityId,
          user: userId,
        },
        {
          title,
          type,
          text,
          comments: 1,
          community: secondCommunityId,
          user: userId,
        },
      ];

      await Post.insertMany(postsArr);
      const { posts, postsCount } = await getPostsByCommunityId(
        communityId,
        sort,
        limit,
        page,
      );
      if (!posts) {
        return;
      }
      expect(posts).toHaveLength(3);
      expect(posts[0].comments).toBe(40);
      expect(posts[1].comments).toBe(30);
      expect(posts[2].comments).toBe(20);
    });
    it(`should return a list of posts sorted by new`, async (): Promise<
      void
    > => {
      const sort = 'new';
      const secondCommunityId = mongoose.Types.ObjectId().toString();
      const postsArr = [
        {
          title: 'first',
          type,
          text,
          community: communityId,
          user: userId,
        },
        {
          title: 'second',
          type,
          text,
          community: communityId,
          user: userId,
        },
        {
          title: 'third',
          type,
          text,
          community: communityId,
          user: userId,
        },
        {
          title,
          type,
          text,
          comments: 1,
          community: secondCommunityId,
          user: userId,
        },
      ];

      await Post.insertMany(postsArr);
      const { posts, postsCount } = await getPostsByCommunityId(
        communityId,
        sort,
        limit,
        page,
      );
      if (!posts) {
        return;
      }
      expect(posts).toHaveLength(3);
      expect(posts[0].title).toMatch('first');
      expect(posts[1].title).toMatch('second');
      expect(posts[2].title).toMatch('third');
    });
    it(`shouldn't throw an error if no posts are found`, async (): Promise<
      void
    > => {
      const sort = 'top';
      const { status, message } = Errors.NotFound;
      const error = new ErrorREST(status, message, null);
      await expect(
        getPostsByCommunityId(communityId, sort, limit, page),
      ).rejects.toThrow(error);
    });
  });
});
