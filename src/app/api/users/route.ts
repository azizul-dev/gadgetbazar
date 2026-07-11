import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { getCurrentUser } from "@/lib/getCurrentUser";

// GET /api/users — সব ইউজারের লিস্ট (শুধু Admin)
// সাপোর্টেড query params:
//   ?search=name বা email দিয়ে সার্চ
//   ?role=user বা admin দিয়ে ফিল্টার
//   ?page=1&limit=20
export async function GET(req: NextRequest) {
  try {
    const currentUser = getCurrentUser(req);

    if (!currentUser) {
      return NextResponse.json(
        { success: false, message: "এই কাজের জন্য লগইন করতে হবে" },
        { status: 401 }
      );
    }

    if (currentUser.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "এই তথ্য দেখার অনুমতি আপনার নেই" },
        { status: 403 }
      );
    }

    await connectDB();

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");
    const role = searchParams.get("role");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);

    const filter: Record<string, any> = {};

    if (role) filter.role = role;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      User.find(filter)
        .select("-password")
        .sort("-createdAt")
        .skip(skip)
        .limit(limit),
      User.countDocuments(filter),
    ]);

    return NextResponse.json({
      success: true,
      data: users,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get users error:", error);
    return NextResponse.json(
      { success: false, message: "ইউজার লোড করা যায়নি" },
      { status: 500 }
    );
  }
}