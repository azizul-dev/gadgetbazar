import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Gadget from "@/models/Gadget";

// GET /api/gadgets/:id — একটা নির্দিষ্ট গ্যাজেট দেখাবে
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const gadget = await Gadget.findById(id);

    if (!gadget) {
      return NextResponse.json(
        { success: false, message: "গ্যাজেট পাওয়া যায়নি" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: gadget });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "সার্ভার এরর" },
      { status: 500 }
    );
  }
}

// PUT /api/gadgets/:id — গ্যাজেট আপডেট করবে
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();

    const gadget = await Gadget.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!gadget) {
      return NextResponse.json(
        { success: false, message: "গ্যাজেট পাওয়া যায়নি" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: gadget });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "আপডেট করা যায়নি" },
      { status: 500 }
    );
  }
}

// DELETE /api/gadgets/:id — গ্যাজেট ডিলিট করবে
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    const gadget = await Gadget.findByIdAndDelete(id);

    if (!gadget) {
      return NextResponse.json(
        { success: false, message: "গ্যাজেট পাওয়া যায়নি" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: "ডিলিট সফল হয়েছে" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "ডিলিট করা যায়নি" },
      { status: 500 }
    );
  }
}