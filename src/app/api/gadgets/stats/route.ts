import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Gadget from "@/models/Gadget";

// GET /api/gadgets/stats — প্রতি ক্যাটাগরিতে কয়টা available গ্যাজেট আছে
export async function GET() {
  try {
    await connectDB();

    const results = await Gadget.aggregate([
      { $match: { status: "available" } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);

    // সব ক্যাটাগরি ডিফল্ট 0 দিয়ে শুরু, তারপর real count বসানো
    const counts: Record<string, number> = {
      phone: 0,
      laptop: 0,
      camera: 0,
      audio: 0,
      gaming: 0,
      other: 0,
    };

    results.forEach((r) => {
      if (r._id in counts) counts[r._id] = r.count;
    });

    return NextResponse.json({ success: true, data: counts });
  } catch (error) {
    console.error("Get gadget stats error:", error);
    return NextResponse.json(
      { success: false, message: "স্ট্যাটস লোড করা যায়নি" },
      { status: 500 }
    );
  }
}
