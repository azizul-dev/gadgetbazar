import mongoose, { Schema, models, model } from "mongoose";

export interface IReview {
  gadgetId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  rating: number;
  comment: string;
  createdAt: Date;
}

const ReviewSchema = new Schema<IReview>({
  gadgetId: {
    type: Schema.Types.ObjectId,
    ref: "Gadget",
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// একজন ইউজার একটা গ্যাজেটে একবারই রিভিউ দিতে পারবে
ReviewSchema.index({ gadgetId: 1, userId: 1 }, { unique: true });

const Review = models.Review || model<IReview>("Review", ReviewSchema);

export default Review;
