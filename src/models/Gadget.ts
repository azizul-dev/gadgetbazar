import mongoose, { Schema, models, model } from "mongoose";

export interface IGadget {
  title: string;
  category: "phone" | "laptop" | "camera" | "audio" | "gaming" | "other";
  price: number;
  condition: "new" | "used" | "refurbished";
  shortDescription: string;
  fullDescription: string;
  images: string[];
  location: string;
  sellerId: mongoose.Types.ObjectId;
  status: "available" | "sold";
  createdAt: Date;
}

const GadgetSchema = new Schema<IGadget>({
  title: { type: String, required: true },
  category: {
    type: String,
    enum: ["phone", "laptop", "camera", "audio", "gaming", "other"],
    required: true,
  },
  price: { type: Number, required: true },
  condition: {
    type: String,
    enum: ["new", "used", "refurbished"],
    required: true,
  },
  shortDescription: { type: String, required: true },
  fullDescription: { type: String, required: true },
  images: { type: [String], default: [] },
  location: { type: String, required: true },
  sellerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  status: { type: String, enum: ["available", "sold"], default: "available" },
  createdAt: { type: Date, default: Date.now },
});

const Gadget = models.Gadget || model<IGadget>("Gadget", GadgetSchema);

export default Gadget;