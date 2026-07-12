import mongoose, { Schema, models, model } from "mongoose";

export interface ITestimonial {
  name: string;
  role: string;
  text: string;
  rating: number;
  createdAt: Date;
}

const TestimonialSchema = new Schema<ITestimonial>({
  name: { type: String, required: true, trim: true },
  role: { type: String, required: true, trim: true },
  text: { type: String, required: true, maxlength: 300 },
  rating: { type: Number, required: true, min: 1, max: 5, default: 5 },
  createdAt: { type: Date, default: Date.now },
});

export default models.Testimonial ||
  model<ITestimonial>("Testimonial", TestimonialSchema);