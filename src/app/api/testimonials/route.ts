import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db"; // আপনার db.ts এ যেভাবে export করা আছে সেভাবে adjust করুন
import Testimonial from "@/models/Testimonial";

export async function GET() {
  try {
    await connectDB();
    const testimonials = await Testimonial.find()
      .sort({ createdAt: -1 })
      .limit(6)
      .lean();

    return NextResponse.json({ success: true, data: testimonials });
  } catch {
    return NextResponse.json(
      { success: false, message: "Could not fetch testimonials" },
      { status: 500 }
    );
  }
}