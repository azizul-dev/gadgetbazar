import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Gadget from "@/models/Gadget";

// GET /api/gadgets — সব গ্যাজেট দেখাবে
export async function GET() {
  try {
    await connectDB();
    const gadgets = await Gadget.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: gadgets });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "কানেকশন এরর হয়েছে" },
      { status: 500 }
    );
  }
}

// POST /api/gadgets — নতুন গ্যাজেট যোগ করবে
export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();

    const gadget = await Gadget.create(body);

    return NextResponse.json(
      { success: true, data: gadget },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "গ্যাজেট তৈরি করা যায়নি" },
      { status: 500 }
    );
  }
}