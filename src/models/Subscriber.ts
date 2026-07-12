import { Schema, models, model } from "mongoose";

export interface ISubscriber {
  email: string;
  createdAt: Date;
}

const SubscriberSchema = new Schema<ISubscriber>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  createdAt: { type: Date, default: Date.now },
});

export default models.Subscriber ||
  model<ISubscriber>("Subscriber", SubscriberSchema);