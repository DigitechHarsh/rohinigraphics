import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Inquiry from '@/models/Inquiry';

// GET: Fetch list of inquiries with filtering parameters
export async function GET(request) {
  try {
    await dbConnect();
    
    // Parse URL search parameters
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const product = searchParams.get('product') || 'all';
    const status = searchParams.get('status') || 'all';
    const priority = searchParams.get('priority') || 'all';

    // Build Mongoose query
    let filterQuery = {};

    // 1. Text Search across multiple fields
    if (search) {
      filterQuery.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } },
        { inquiryId: { $regex: search, $options: 'i' } }
      ];
    }

    // 2. Product Category Filter
    if (product !== 'all') {
      filterQuery.product = { $regex: product, $options: 'i' };
    }

    // 3. Status Filter
    if (status !== 'all') {
      filterQuery.status = status;
    }

    // 4. Priority Filter
    if (priority !== 'all') {
      filterQuery.priority = priority;
    }

    // Fetch and sort by newest first
    const inquiries = await Inquiry.find(filterQuery).sort({ createdAt: -1 });
    
    return NextResponse.json({ success: true, data: inquiries }, { status: 200 });
  } catch (error) {
    console.error('API Error in GET inquiries:', error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST: Submit a new customer inquiry form
export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();

    if (!body.name || !body.phone || !body.product || !body.message) {
      return NextResponse.json({ success: false, error: 'Missing required fields!' }, { status: 400 });
    }

    const newInquiry = await Inquiry.create({
      name: body.name,
      phone: body.phone,
      email: body.email || 'Not Provided',
      product: body.product,
      budget: body.budget || 'Not Specified',
      priority: body.priority || 'Normal',
      message: body.message,
      status: 'Pending',
      notes: ''
    });

    return NextResponse.json({ success: true, data: newInquiry }, { status: 201 });
  } catch (error) {
    console.error('API Error in POST inquiries:', error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
