import { NextRequest } from "next/server";
import { verifyToken, TokenPayload } from "@/lib/auth";

// Cookie থেকে JWT টোকেন পড়ে, ভেরিফাই করে ইউজার ইনফো রিটার্ন করে
// টোকেন না থাকলে বা ইনভ্যালিড হলে null রিটার্ন করে (ভুল ছুড়বে না)
export function getCurrentUser(req: NextRequest): TokenPayload | null {
  const token = req.cookies.get("token")?.value;
  if (!token) return null;

  const decoded = verifyToken(token);
  return decoded;
}
