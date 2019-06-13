import Rule from '@rddt/common/types/Rule';
import mongoose, { Schema, Document } from 'mongoose';
type RuleType = Rule & Document;
export default RuleType;
