import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const JWT_SECRET = process.env.JWT_SECRET as string;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in .env.local");
}

export interface TokenPayload {
  userId: string;
  email: string;
  role: "user" | "admin";
}

// পাসওয়ার্ড হ্যাশ করা (register এর সময় ব্যবহার হবে)
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

// পাসওয়ার্ড মিলিয়ে দেখা (login এর সময় ব্যবহার হবে)
export async function comparePassword(
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(plainPassword, hashedPassword);
}

// JWT টোকেন তৈরি করা (login সফল হলে)
export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

// JWT টোকেন ভেরিফাই করা (middleware বা protected route এ)
export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (error) {
    return null;
  }
}