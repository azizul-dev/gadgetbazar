import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Message from "@/models/Message";

// POST /api/contact — কন্টাক্ট ফর্ম সাবমিট (সবার জন্য উন্মুক্ত, লগইন লাগবে না)
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const { name, email, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, message: "সব ফিল্ড পূরণ করতে হবে" },
        { status: 400 }
      );
    }

    // সাধারণ ইমেইল ফরম্যাট চেক
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: "সঠিক ইমেইল দিন" },
        { status: 400 }
      );
    }

    const savedMessage = await Message.create({ name, email, message });

    return NextResponse.json(
      { success: true, data: savedMessage },
      { status: 201 }
    );
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { success: false, message: "মেসেজ পাঠানো যায়নি, আবার চেষ্টা করুন" },
      { status: 500 }
    );
  }
}

// GET /api/contact — সব মেসেজ দেখার জন্য (ভবিষ্যতে Admin Dashboard-এ ব্যবহার করা যাবে)
export async function GET() {
  try {
    await connectDB();
    const messages = await Message.find().sort("-createdAt");
    return NextResponse.json({ success: true, data: messages });
  } catch (error) {
    console.error("Get messages error:", error);
    return NextResponse.json(
      { success: false, message: "মেসেজ লোড করা যায়নি" },
      { status: 500 }
    );
  }
}
