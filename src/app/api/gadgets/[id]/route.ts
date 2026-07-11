import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import Gadget from "@/models/Gadget";
import { getCurrentUser } from "@/lib/getCurrentUser";

// GET /api/gadgets/:id — একটা নির্দিষ্ট গ্যাজেটের বিস্তারিত (সবার জন্য)
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

    const gadget = await Gadget.findById(id).populate(
      "sellerId",
      "name email"
    );

    if (!gadget) {
      return NextResponse.json(
        { success: false, message: "গ্যাজেট পাওয়া যায়নি" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: gadget });
  } catch (error) {
    console.error("Get gadget error:", error);
    return NextResponse.json(
      { success: false, message: "সার্ভার এরর" },
      { status: 500 }
    );
  }
}

// PUT /api/gadgets/:id — শুধু মালিক অথবা admin আপডেট করতে পারবে
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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

    // মালিক নাকি admin — চেক করা (দুটোর একটাও না হলে 403)
    const isOwner = gadget.sellerId.toString() === currentUser.userId;
    const isAdmin = currentUser.role === "admin";

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { success: false, message: "এই গ্যাজেট এডিট করার অনুমতি নেই" },
        { status: 403 }
      );
    }

    const body = await req.json();

    // শুধু এই ফিল্ডগুলোই আপডেট হতে দেওয়া হবে
    // sellerId কখনো এখানে থেকে বদলানো যাবে না
    const allowedFields = [
      "title",
      "category",
      "price",
      "condition",
      "shortDescription",
      "fullDescription",
      "images",
      "location",
      "status",
    ];

    const updateData: Record<string, any> = {};
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }

    const updatedGadget = await Gadget.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    return NextResponse.json({ success: true, data: updatedGadget });
  } catch (error) {
    console.error("Update gadget error:", error);
    return NextResponse.json(
      { success: false, message: "আপডেট করা যায়নি" },
      { status: 500 }
    );
  }
}

// DELETE /api/gadgets/:id — শুধু মালিক অথবা admin ডিলিট করতে পারবে
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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

    const isOwner = gadget.sellerId.toString() === currentUser.userId;
    const isAdmin = currentUser.role === "admin";

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { success: false, message: "এই গ্যাজেট ডিলিট করার অনুমতি নেই" },
        { status: 403 }
      );
    }

    await Gadget.findByIdAndDelete(id);

    return NextResponse.json({ success: true, message: "ডিলিট সফল হয়েছে" });
  } catch (error) {
    console.error("Delete gadget error:", error);
    return NextResponse.json(
      { success: false, message: "ডিলিট করা যায়নি" },
      { status: 500 }
    );
  }
}
