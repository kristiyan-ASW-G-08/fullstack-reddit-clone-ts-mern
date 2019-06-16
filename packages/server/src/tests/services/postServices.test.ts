import { createPost, getPostById } from '../../services/postServices';
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
});
