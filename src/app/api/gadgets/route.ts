import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Gadget from "@/models/Gadget";
import { getCurrentUser } from "@/lib/getCurrentUser";

// GET /api/gadgets — সব গ্যাজেট (ফিল্টার, সার্চ, পেজিনেশন সহ)
// সাপোর্টেড query params:
//   ?category=phone
//   ?condition=used
//   ?minPrice=1000&maxPrice=50000
//   ?search=iphone   (title-এ সার্চ করবে)
//   ?status=available (ডিফল্ট: available)
//   ?page=1&limit=12
//   ?sort=-createdAt  (নতুন আগে) অথবা sort=price (কম দাম আগে) অথবা sort=-price
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);

    const category = searchParams.get("category");
    const condition = searchParams.get("condition");
    const search = searchParams.get("search");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const sellerId = searchParams.get("sellerId");
    const statusParam = searchParams.get("status");
    const status = statusParam || (sellerId ? undefined : "available");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "12", 10);
    const sort = searchParams.get("sort") || "-createdAt";

    // ডাইনামিক ফিল্টার অবজেক্ট তৈরি
    // ডাইনামিক ফিল্টার অবজেক্ট তৈরি
    const filter: Record<string, any> = {};

    if (status) filter.status = status;
    if (sellerId) filter.sellerId = sellerId;
    if (category) filter.category = category;
    if (condition) filter.condition = condition;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (search) {
      // case-insensitive title সার্চ
      filter.title = { $regex: search, $options: "i" };
    }

    const skip = (page - 1) * limit;

    const [gadgets, total] = await Promise.all([
      Gadget.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate("sellerId", "name email"),
      Gadget.countDocuments(filter),
    ]);

    return NextResponse.json({
      success: true,
      data: gadgets,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get gadgets error:", error);
    return NextResponse.json(
      { success: false, message: "গ্যাজেট লোড করা যায়নি" },
      { status: 500 }
    );
  }
}

// POST /api/gadgets — নতুন গ্যাজেট যোগ (শুধু লগইন করা ইউজার)
export async function POST(req: NextRequest) {
  try {
    const currentUser = getCurrentUser(req);

    if (!currentUser) {
      return NextResponse.json(
        { success: false, message: "এই কাজের জন্য লগইন করতে হবে" },
        { status: 401 }
      );
    }

    await connectDB();

    const body = await req.json();
    const {
      title,
      category,
      price,
      condition,
      shortDescription,
      fullDescription,
      images,
      location,
    } = body;

    // প্রয়োজনীয় ফিল্ড ভ্যালিডেশন
    if (
      !title ||
      !category ||
      price === undefined ||
      !condition ||
      !shortDescription ||
      !fullDescription ||
      !location
    ) {
      return NextResponse.json(
        { success: false, message: "সব প্রয়োজনীয় ফিল্ড পূরণ করতে হবে" },
        { status: 400 }
      );
    }

    // sellerId কখনো ফ্রন্টএন্ড body থেকে নেওয়া হবে না — সবসময় টোকেন থেকে
    const gadget = await Gadget.create({
      title,
      category,
      price,
      condition,
      shortDescription,
      fullDescription,
      images: images || [],
      location,
      sellerId: currentUser.userId,
      status: "available",
    });

    return NextResponse.json(
      { success: true, data: gadget },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create gadget error:", error);
    return NextResponse.json(
      { success: false, message: "গ্যাজেট তৈরি করা যায়নি" },
      { status: 500 }
    );
  }
}
