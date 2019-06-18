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
const getCommentsBySourceId = async (
  sourceId: string,
  sort: string,
  limit: number,
  page: number,
): Promise<CommentType[]> => {
  try {
    let comments: CommentType[];
    switch (sort) {
      case 'top':
        comments = await Comment.countDocuments()
          .find({ source: sourceId })
          .sort('-upvotes')
          .skip((page - 1) * limit)
          .limit(limit);
        break;
      case 'new':
        comments = await Comment.find({ source: sourceId })
          .countDocuments()
          .find()
          .sort({ date: -1 })
          .skip((page - 1) * limit)
          .limit(limit);
        break;
      case 'comments':
        comments = await Comment.countDocuments()
          .find({ source: sourceId })
          .sort('-comments')
          .skip((page - 1) * limit)
          .limit(limit);
        break;
      default:
        comments = await Comment.countDocuments()
          .find({ source: sourceId })
          .sort('-upvotes')
          .skip((page - 1) * limit)
          .limit(limit);
        break;
    }
    if (!comments || comments.length === 0) {
      const { status, message } = Errors.NotFound;
      const error = new ErrorREST(status, message);
      throw error;
    }
    return comments;
  } catch (err) {
    throw err;
  }
};

export { createComment, getCommentById, getCommentsBySourceId };
