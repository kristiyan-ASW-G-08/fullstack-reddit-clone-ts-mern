import {
  createPost,
  getPostById,
  getPosts,
  getPostsByCommunityId,
} from '../../services/postServices';
import Post from '../../models/Post';
import { ErrorREST, Errors } from '../../classes/ErrorREST';
import mongoose, { mongo } from 'mongoose';
import { mongoURI } from '../../config/db';
import User from '../../models/User';
import Community from '../../models/Community';

describe('postServices', (): void => {
  beforeAll(
    async (): Promise<void> => {
      mongoose.connect(mongoURI, { useNewUrlParser: true });
      await Community.deleteMany({}).exec();
      await User.deleteMany({}).exec();
      await Post.deleteMany({}).exec();
    },
  );
  afterEach(
    async (): Promise<void> => {
      await Community.deleteMany({}).exec();
      await User.deleteMany({}).exec();
      await Post.deleteMany({}).exec();
    },
  );
  afterAll(
    async (): Promise<void> => {
      await User.deleteMany({}).exec();
      await Post.deleteMany({}).exec();
      await mongoose.disconnect();
    },
  );
  const title = 'testName';
  const text = 'Lorem ipsum dolor sit amet, consectetur';

  describe('createPost', (): void => {
    const userId = mongoose.Types.ObjectId().toString();
    const communityId = mongoose.Types.ObjectId().toString();
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
    const userId = mongoose.Types.ObjectId();
    const communityId = mongoose.Types.ObjectId();
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
    let userId: string;
    let communityId: string;
    let secondCommunityId: string;
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
        const name = 'name';
        const description = 'Test Description';
        userId = newUser._id;
        const firstCommunity = new Community({
          name,
          description,
          user: userId,
        });
        const secondCommunity = new Community({
          name,
          description,
          user: userId,
        });
        await secondCommunity.save();
        await firstCommunity.save();

        communityId = firstCommunity._id;
        secondCommunityId = secondCommunity._id;
      },
    );
    const limit = 25;
    const page = 1;

    const type = 'text';
    it(`should return a list of posts by upvotes(top)`, async (): Promise<
      void
    > => {
      const postsArr = [
        {
          title: 'first',
          type,
          text,
          upvotes: 100,
          comments: 40,
          community: communityId,
          user: userId,
        },
        {
          title: 'second',
          type,
          text,
          upvotes: 300,
          comments: 20,
          community: communityId,
          user: userId,
        },
        {
          title: 'third',
          type,
          text,
          comments: 30,
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
      const sort = 'top';
      console.log(postsArr);
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
      const postsArr = [
        {
          title: 'first',
          type,
          text,
          upvotes: 100,
          comments: 40,
          community: communityId,
          user: userId,
        },
        {
          title: 'second',
          type,
          text,
          upvotes: 300,
          comments: 20,
          community: communityId,
          user: userId,
        },
        {
          title: 'third',
          type,
          text,
          comments: 30,
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
      expect(posts[0].comments).toBe(40);
      expect(posts[1].comments).toBe(30);
      expect(posts[2].comments).toBe(20);
    });
    it(`should return a list of posts sorted by new`, async (): Promise<
      void
    > => {
      const postsArr = [
        {
          title: 'first',
          type,
          text,
          upvotes: 100,
          comments: 40,
          community: communityId,
          user: userId,
        },
        {
          title: 'second',
          type,
          text,
          upvotes: 300,
          comments: 20,
          community: communityId,
          user: userId,
        },
        {
          title: 'third',
          type,
          text,
          comments: 30,
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
      const sort = 'new';
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
      const postsArr = [
        {
          title: 'first',
          type,
          text,
          upvotes: 100,
          comments: 40,
          community: communityId,
          user: userId,
        },
        {
          title: 'second',
          type,
          text,
          upvotes: 300,
          comments: 20,
          community: communityId,
          user: userId,
        },
        {
          title: 'third',
          type,
          text,
          comments: 30,
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
      const sort = 'top';
      const { status, message } = Errors.NotFound;
      const error = new ErrorREST(status, message, null);
      await expect(
        getPostsByCommunityId(communityId, sort, limit, page),
      ).rejects.toThrow(error);
    });
  });

  describe('getPosts', (): void => {
    let userId: string;
    let communityId: string;
    let secondCommunityId: string;
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
        const name = 'name';
        const description = 'Test Description';
        userId = newUser._id;
        const firstCommunity = new Community({
          name,
          description,
          user: userId,
        });
        const secondCommunity = new Community({
          name,
          description,
          user: userId,
        });
        await secondCommunity.save();
        await firstCommunity.save();

        communityId = firstCommunity._id;
        secondCommunityId = secondCommunity._id;
      },
    );
    const limit = 25;
    const page = 1;
    const type = 'text';
    it(`should return a list of posts by upvotes(top)`, async (): Promise<
      void
    > => {
      const postsArr = [
        {
          title: 'first',
          type,
          text,
          upvotes: 100,
          comments: 40,
          community: communityId,
          user: userId,
        },
        {
          title: 'second',
          type,
          text,
          upvotes: 300,
          comments: 20,
          community: communityId,
          user: userId,
        },
        {
          title: 'third',
          type,
          text,
          comments: 30,
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
      const sort = 'top';
      await Post.insertMany(postsArr);
      const { posts, postsCount } = await getPosts(sort, limit, page);
      if (!posts) {
        return;
      }
      expect(posts).toHaveLength(4);
      expect(posts[0].upvotes).toBe(300);
      expect(posts[1].upvotes).toBe(200);
      expect(posts[2].upvotes).toBe(100);
    });
    it(`should return a list of posts sorted by comments`, async (): Promise<
      void
    > => {
      const sort = 'comments';
      const postsArr = [
        {
          title: 'first',
          type,
          text,
          upvotes: 100,
          comments: 40,
          community: communityId,
          user: userId,
        },
        {
          title: 'second',
          type,
          text,
          upvotes: 300,
          comments: 20,
          community: communityId,
          user: userId,
        },
        {
          title: 'third',
          type,
          text,
          comments: 30,
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
      const { posts, postsCount } = await getPosts(sort, limit, page);
      if (!posts) {
        return;
      }
      expect(posts).toHaveLength(4);
      expect(posts[0].comments).toBe(40);
      expect(posts[1].comments).toBe(30);
      expect(posts[2].comments).toBe(20);
    });
    it(`should return a list of posts sorted by new`, async (): Promise<
      void
    > => {
      const sort = 'new';
      const postsArr = [
        {
          title: 'first',
          type,
          text,
          upvotes: 100,
          comments: 40,
          community: communityId,
          user: userId,
        },
        {
          title: 'second',
          type,
          text,
          upvotes: 300,
          comments: 20,
          community: communityId,
          user: userId,
        },
        {
          title: 'third',
          type,
          text,
          comments: 30,
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
      const { posts, postsCount } = await getPosts(sort, limit, page);
      if (!posts) {
        return;
      }
      expect(posts).toHaveLength(4);
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
