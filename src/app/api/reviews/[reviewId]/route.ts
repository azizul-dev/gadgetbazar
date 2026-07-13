import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import Review from "@/models/Review";
import { getCurrentUser } from "@/lib/getCurrentUser";

// DELETE /api/reviews/:reviewId — শুধু নিজের রিভিউ অথবা admin ডিলিট করতে পারবে
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ reviewId: string }> }
) {
  try {
    const currentUser = getCurrentUser(req);

    if (!currentUser) {
      return NextResponse.json(
        { success: false, message: "এই কাজের জন্য লগইন করতে হবে" },
        { status: 401 }
      );
    }

    await connectDB();
    const { reviewId } = await params;

    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      return NextResponse.json(
        { success: false, message: "ইনভ্যালিড আইডি" },
        { status: 400 }
      );
    }

    const review = await Review.findById(reviewId);
    if (!review) {
      return NextResponse.json(
        { success: false, message: "রিভিউ পাওয়া যায়নি" },
        { status: 404 }
      );
    }

    const isOwner = review.userId.toString() === currentUser.userId;
    const isAdmin = currentUser.role === "admin";

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { success: false, message: "এই রিভিউ ডিলিট করার অনুমতি নেই" },
        { status: 403 }
      );
    }

    await Review.findByIdAndDelete(reviewId);

    return NextResponse.json({ success: true, message: "ডিলিট সফল হয়েছে" });
  } catch (error) {
    console.error("Delete review error:", error);
    return NextResponse.json(
      { success: false, message: "ডিলিট করা যায়নি" },
      { status: 500 }
    );
  }
}
