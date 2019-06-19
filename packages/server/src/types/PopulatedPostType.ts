import PopulatedPost from '@rddt/common/types/PopulatedPost';
import { Document } from 'mongoose';
type PopulatedPostType = PopulatedPost & Document;
export default PopulatedPostType;
