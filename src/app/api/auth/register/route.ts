import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { hashPassword, signToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    // ভ্যালিডেশন
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "সব ফিল্ড পূরণ করা আবশ্যক" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: "পাসওয়ার্ড কমপক্ষে ৬ ক্যারেক্টার হতে হবে" },
        { status: 400 }
      );
    }

    await connectDB();

    // ইমেইল আগে থেকে আছে কিনা চেক
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { message: "এই ইমেইল দিয়ে আগে থেকেই একটি একাউন্ট আছে" },
        { status: 409 }
      );
    }

    // পাসওয়ার্ড হ্যাশ করা
    const hashedPassword = await hashPassword(password);

    // নতুন ইউজার তৈরি (role সবসময় "user", কখনো ফ্রন্টএন্ড থেকে নেওয়া হবে না)
    const newUser = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: "user",
    });

    // JWT টোকেন তৈরি
    const token = signToken({
      userId: newUser._id.toString(),
      email: newUser.email,
      role: newUser.role,
    });

    // রেসপন্স তৈরি এবং httpOnly cookie তে টোকেন সেট করা
    const response = NextResponse.json(
      {
        message: "রেজিস্ট্রেশন সফল হয়েছে",
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
        },
      },
      { status: 201 }
    );

    response.cookies.set("token", token, {
      httpOnly: true, // JavaScript থেকে অ্যাক্সেস করা যাবে না (XSS প্রোটেকশন)
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // ৭ দিন
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { message: "সার্ভার এরর হয়েছে, পরে আবার চেষ্টা করুন" },
      { status: 500 }
    );
  }
}