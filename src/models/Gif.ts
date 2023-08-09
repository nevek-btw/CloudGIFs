import mongoose, { Document, Schema } from 'mongoose';

export interface IGif extends Document {
  name: string;
  category: string;
  source?: string;
}

const gifSchema = new Schema({
  name: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  source: {type: String, default: null },
});

export default mongoose.model<IGif>('Gif', gifSchema);
