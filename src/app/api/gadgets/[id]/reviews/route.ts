import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import Review from "@/models/Review";
import Gadget from "@/models/Gadget";
import { getCurrentUser } from "@/lib/getCurrentUser";

// GET /api/gadgets/:id/reviews — গ্যাজেটের সব রিভিউ + গড় রেটিং (সবার জন্য)
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "ইনভ্যালিড আইডি" },
        { status: 400 }
      );
    }

    const reviews = await Review.find({ gadgetId: id })
      .populate("userId", "name")
      .sort({ createdAt: -1 });

    const count = reviews.length;
    const average =
      count > 0
        ? Number(
            (reviews.reduce((sum, r) => sum + r.rating, 0) / count).toFixed(1)
          )
        : 0;

    return NextResponse.json({
      success: true,
      data: { reviews, average, count },
    });
  } catch (error) {
    console.error("Get reviews error:", error);
    return NextResponse.json(
      { success: false, message: "সার্ভার এরর" },
      { status: 500 }
    );
  }
}

// POST /api/gadgets/:id/reviews — লগইন করা ইউজার রিভিউ দিতে পারবে (একবারই, তারপর আপডেট হবে)
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = getCurrentUser(req);

    if (!currentUser) {
      return NextResponse.json(
        { success: false, message: "রিভিউ দিতে হলে লগইন করতে হবে" },
        { status: 401 }
      );
    }

    await connectDB();
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "ইনভ্যালিড আইডি" },
        { status: 400 }
      );
    }

    const gadget = await Gadget.findById(id);
    if (!gadget) {
      return NextResponse.json(
        { success: false, message: "গ্যাজেট পাওয়া যায়নি" },
        { status: 404 }
      );
    }

    const body = await req.json();
    const { rating, comment } = body;

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { success: false, message: "রেটিং ১ থেকে ৫ এর মধ্যে দিতে হবে" },
        { status: 400 }
      );
    }

    if (!comment || !comment.trim()) {
      return NextResponse.json(
        { success: false, message: "রিভিউ লিখুন" },
        { status: 400 }
      );
    }

    const existing = await Review.findOne({
      gadgetId: id,
      userId: currentUser.userId,
    });

    let review;
    if (existing) {
      existing.rating = rating;
      existing.comment = comment.trim();
      review = await existing.save();
    } else {
      review = await Review.create({
        gadgetId: id,
        userId: currentUser.userId,
        rating,
        comment: comment.trim(),
      });
    }

    await review.populate("userId", "name");

    return NextResponse.json({ success: true, data: review });
  } catch (error) {
    console.error("Create review error:", error);
    return NextResponse.json(
      { success: false, message: "রিভিউ জমা দেওয়া যায়নি" },
      { status: 500 }
    );
  }
}
