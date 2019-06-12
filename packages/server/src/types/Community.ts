import Community from '@rddt/common/types/Community';
import mongoose, { Schema, Document } from 'mongoose';
type CommunityType = Community & Document;
export default CommunityType;
