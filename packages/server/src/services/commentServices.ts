import Comment from '../models/Comment';
import CommentType from '../types/Comment';
import { ErrorREST, Errors } from '../classes/ErrorREST';
const createComment = async (
  text: string,
  userId: string,
  sourceId: string,
  onModel: string,
): Promise<CommentType> => {
  try {
    const comment = new Comment({
      text,
      source: sourceId,
      onModel,
      user: userId,
    });
    await comment.save();
    return comment;
  } catch (err) {
    throw err;
  }
};
const getCommentById = async (commentId: string): Promise<CommentType> => {
  try {
    const comment = await Comment.findById(commentId);
    if (!comment) {
      const { status, message } = Errors.NotFound;
      const error = new ErrorREST(status, message);
      throw error;
    }
    return comment;
  } catch (err) {
    throw err;
  }
};
interface GetCommentsResponse {
  comments: CommentType[];
  commentsCount: number;
}
const getCommentsBySourceId = async (
  sourceId: string,
  sort: string,
  limit: number,
  page: number,
): Promise<GetCommentsResponse> => {
  try {
    let sortString: string;
    switch (sort) {
      case 'top':
        sortString = '-upvotes';
        break;
      case 'new':
        sortString = '-date';
        break;
      case 'comments':
        sortString = '-comments';
        break;
      default:
        sortString = '-upvotes';
        break;
    }
    const comments = await Comment.countDocuments()
      .find({ source: sourceId })
      .sort(sortString)
      .skip((page - 1) * limit)
      .limit(limit);
    if (!comments || comments.length === 0) {
      const { status, message } = Errors.NotFound;
      const error = new ErrorREST(status, message);
      throw error;
    }
    const commentsCount = (await Comment.countDocuments()) - page * limit;
    return { comments, commentsCount };
  } catch (err) {
    throw err;
  }
};
const toggleHiddenComments = async (
  userId: string,
  hidden: boolean,
  communityId?: string,
): Promise<void> => {
  try {
    let updateOptions: any = { user: userId };
    if (communityId) {
      updateOptions = { user: userId, community: communityId };
    }
    await Comment.updateMany(updateOptions, { $set: { hidden } });
  } catch (err) {
    throw err;
  }
};
export {
  createComment,
  getCommentById,
  getCommentsBySourceId,
  toggleHiddenComments,
};
