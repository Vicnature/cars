import { sanityClient } from "@/lib/sanity";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { partId, customerName, contact, quantity, notes } = body;

    if (!partId || !contact) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const result = await sanityClient.create({
      _type: "order",
      part: {
        _type: "reference",
        _ref: partId,
      },
      customerName,
      contact,
      quantity,
      notes,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, orderId: result._id });
  } catch (error) {
    console.error("Order submission failed:", error);
    return NextResponse.json({ error: "Failed to submit order" }, { status: 500 });
  }
}
