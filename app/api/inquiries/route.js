import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';

export const dynamic = 'force-dynamic';

// GET: Fetch list of inquiries with filtering parameters
export async function GET(request) {
  try {
    // Parse URL search parameters
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const product = searchParams.get('product') || 'all';
    const status = searchParams.get('status') || 'all';
    const priority = searchParams.get('priority') || 'all';

    // Build SQL query
    let query = 'SELECT * FROM inquiries WHERE 1=1';
    const params = [];

    // 1. Text Search across multiple fields
    if (search) {
      query += ' AND (name LIKE ? OR email LIKE ? OR phone LIKE ? OR message LIKE ? OR inquiryId LIKE ?)';
      const searchWildcard = `%${search}%`;
      params.push(searchWildcard, searchWildcard, searchWildcard, searchWildcard, searchWildcard);
    }

    // 2. Product Category Filter
    if (product !== 'all') {
      query += ' AND product LIKE ?';
      params.push(`%${product}%`);
    }

    // 3. Status Filter
    if (status !== 'all') {
      query += ' AND status = ?';
      params.push(status);
    }

    // 4. Priority Filter
    if (priority !== 'all') {
      query += ' AND priority = ?';
      params.push(priority);
    }

    // Fetch and sort by newest first
    query += ' ORDER BY createdAt DESC';
    const inquiries = await executeQuery(query, params);

    // Map id to _id for React frontend key stability
    const formattedInquiries = inquiries.map(inq => ({
      ...inq,
      _id: inq.id.toString()
    }));
    
    return NextResponse.json({ success: true, data: formattedInquiries }, { status: 200 });
  } catch (error) {
    console.error('API Error in GET inquiries:', error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST: Submit a new customer inquiry form
export async function POST(request) {
  try {
    const body = await request.json();

    if (!body.name || !body.phone || !body.product || !body.message) {
      return NextResponse.json({ success: false, error: 'Missing required fields!' }, { status: 400 });
    }

    const inquiryId = `INQ-${Math.floor(1000 + Math.random() * 9000)}`;
    const name = body.name;
    const phone = body.phone;
    const email = body.email || 'Not Provided';
    const product = body.product;
    const budget = body.budget || 'Not Specified';
    const priority = body.priority || 'Normal';
    const message = body.message;
    const status = 'Pending';
    const notes = '';

    await executeQuery(
      `INSERT INTO inquiries (inquiryId, name, phone, email, product, budget, priority, message, status, notes, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [inquiryId, name, phone, email, product, budget, priority, message, status, notes]
    );

    const results = await executeQuery('SELECT * FROM inquiries WHERE inquiryId = ?', [inquiryId]);
    const newInquiry = results[0];

    if (newInquiry) {
      newInquiry._id = newInquiry.id.toString();
    }

    return NextResponse.json({ success: true, data: newInquiry }, { status: 201 });
  } catch (error) {
    console.error('API Error in POST inquiries:', error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

