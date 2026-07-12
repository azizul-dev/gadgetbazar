import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Subscriber from "@/models/Subscriber";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json(
        { success: false, message: "Valid email is required" },
        { status: 400 }
      );
    }

    await connectDB();

    const existing = await Subscriber.findOne({ email: email.toLowerCase() });
    if (existing) {
      return NextResponse.json(
        { success: true, message: "Already subscribed" },
        { status: 200 }
      );
    }

    await Subscriber.create({ email: email.toLowerCase() });

    return NextResponse.json(
      { success: true, message: "Subscribed successfully" },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { success: false, message: "Something went wrong" },
      { status: 500 }
    );
  }
}