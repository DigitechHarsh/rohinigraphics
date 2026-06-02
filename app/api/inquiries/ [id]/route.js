import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Inquiry from '@/models/Inquiry';

// PATCH: Update status and follow-up notes of a specific customer inquiry
export async function PATCH(request, { params }) {
  try {
    await dbConnect();
    const { id } = params;
    const body = await request.json();

    // Support lookup by either short inquiryId (e.g., INQ-9630) or standard MongoDB _id
    const query = id.startsWith('INQ-') ? { inquiryId: id } : { _id: id };

    // Prepare update parameters
    const updateData = {};
    if (body.status !== undefined) updateData.status = body.status;
    if (body.notes !== undefined) updateData.notes = body.notes;

    const updatedInquiry = await Inquiry.findOneAndUpdate(
      query,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedInquiry) {
      return NextResponse.json({ success: false, error: `Inquiry with ID ${id} not found!` }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedInquiry }, { status: 200 });
  } catch (error) {
    console.error('API Error in PATCH inquiry:', error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
