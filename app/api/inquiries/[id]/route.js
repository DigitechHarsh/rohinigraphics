import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';

// PATCH: Update status and follow-up notes of a specific customer inquiry
export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();

    // Support lookup by either short inquiryId (e.g., INQ-9630) or standard MySQL id (mapped as integer)
    const isShortId = id.startsWith('INQ-');

    // Prepare update parameters
    const updateFields = [];
    const sqlParams = [];

    if (body.status !== undefined) {
      updateFields.push('status = ?');
      sqlParams.push(body.status);
    }
    if (body.notes !== undefined) {
      updateFields.push('notes = ?');
      sqlParams.push(body.notes);
    }

    if (updateFields.length === 0) {
      return NextResponse.json({ success: false, error: 'No fields to update' }, { status: 400 });
    }

    let query = `UPDATE inquiries SET ${updateFields.join(', ')} WHERE `;
    if (isShortId) {
      query += 'inquiryId = ?';
      sqlParams.push(id);
    } else {
      query += 'id = ?';
      sqlParams.push(parseInt(id));
    }

    const result = await executeQuery(query, sqlParams);

    if (result.affectedRows === 0) {
      return NextResponse.json({ success: false, error: `Inquiry with ID ${id} not found!` }, { status: 404 });
    }

    // Retrieve the updated row
    let selectQuery = 'SELECT * FROM inquiries WHERE ';
    let selectParams = [];
    if (isShortId) {
      selectQuery += 'inquiryId = ?';
      selectParams.push(id);
    } else {
      selectQuery += 'id = ?';
      selectParams.push(parseInt(id));
    }

    const results = await executeQuery(selectQuery, selectParams);
    const updatedInquiry = results[0];

    if (updatedInquiry) {
      updatedInquiry._id = updatedInquiry.id.toString();
    }

    return NextResponse.json({ success: true, data: updatedInquiry }, { status: 200 });
  } catch (error) {
    console.error('API Error in PATCH inquiry:', error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

