import Post from '@rddt/common/types/Post';
import mongoose, { Schema, Document } from 'mongoose';
type PostType = Post & Document;
export default PostType;
