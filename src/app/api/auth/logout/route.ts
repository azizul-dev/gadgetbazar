import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json(
    { message: "লগআউট সফল হয়েছে" },
    { status: 200 }
  );

  // কুকি থেকে টোকেন মুছে ফেলা (maxAge: 0 দিলে সাথে সাথে এক্সপায়ার হয়ে যায়)
  response.cookies.set("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });

  return response;
}