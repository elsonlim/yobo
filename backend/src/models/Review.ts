import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IReview extends Document {
  title: string;
  content: string;
  rating: number;
  author: Types.ObjectId; // Reference to User model
  yobo: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    yobo: { type: Boolean, default: false },
  },
  { timestamps: true } // Adds createdAt and updatedAt automatically
);

export default mongoose.model<IReview>('Review', ReviewSchema);
