import Comment from '@rddt/common/types/Comment';
import mongoose, { Schema, Document } from 'mongoose';
type CommentType = Comment & Document;
export default CommentType;
