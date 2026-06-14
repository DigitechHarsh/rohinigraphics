import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';

export const dynamic = 'force-dynamic';

const SEED_INQUIRIES = [
  {
    inquiryId: 'INQ-8802',
    name: 'Dr. Amit Shah',
    phone: '98250 12345',
    email: 'amit.shah@nirmalhospital.com',
    product: 'Safety Signs',
    budget: '50K - 1.5L',
    priority: 'High',
    message: 'Need standard NABH emergency exits, stair glow-in-dark boards, and external entry panels for Nirmal Hospital Expansion.',
    status: 'Pending',
    notes: 'Awaiting urgent site visit confirmation for hospital parameters.',
    createdAt: new Date(Date.now() - 36 * 60 * 60 * 1000)
  },
  {
    inquiryId: 'INQ-7541',
    name: 'Sneha Mehta (Owner)',
    phone: '91733 99887',
    email: 'contact@kekizsurat.com',
    product: 'Lollipop Signs',
    budget: '10K - 50K',
    priority: 'Normal',
    message: 'Need a circular LED Lollipop hanging sign with Kekiz brand styling and warm golden backing SS letters for new shop front.',
    status: 'Contacted',
    notes: 'Sent quote estimate via WhatsApp. Client liked the SS gold finish.',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000)
  },
  {
    inquiryId: 'INQ-9630',
    name: 'Puma Procurement India',
    phone: '97110 54321',
    email: 'retail.support@puma.in',
    product: 'ACP Facade',
    budget: 'Above 5L',
    priority: 'High',
    message: 'Requesting rates for full ACP cladding (approx 1200 sqft elevation) + large red neon backlit acrylic Puma cat logo.',
    status: 'Pending',
    notes: 'High value corporate inquiry. Escalate to Amar Kumar immediately.',
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000)
  },
  {
    inquiryId: 'INQ-3012',
    name: 'Rajesh Patil',
    phone: '98980 44332',
    email: 'rajesh@patilbuilders.com',
    product: 'Large Printing',
    budget: '10K - 50K',
    priority: 'Medium',
    message: 'Required 50 rollup standees and 500 sunpack sheets for political/construction marketing around Gopipura, Surat.',
    status: 'Completed',
    notes: 'Printed, fitted, and successfully delivered to Patil Builders office. Payment cleared.',
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000)
  },
  {
    inquiryId: 'INQ-2209',
    name: 'Aarav Sharma',
    phone: '90333 11223',
    email: 'aarav.sharma@gmail.com',
    product: 'Acrylic Name Plates',
    budget: 'Under 10K',
    priority: 'Low',
    message: 'Need a premium glowing acrylic name plate for my new villa apartment. Size: 18x12 inches with steel mirror spacing studs.',
    status: 'Pending',
    notes: '',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
  }
];

export async function GET() {
  return handleSeed();
}

export async function POST() {
  return handleSeed();
}

async function handleSeed() {
  try {
    // Wipe existing table
    await executeQuery('DELETE FROM inquiries');
    
    // Insert mock seed data
    for (const inq of SEED_INQUIRIES) {
      await executeQuery(
        `INSERT INTO inquiries (inquiryId, name, phone, email, product, budget, priority, message, status, notes, createdAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          inq.inquiryId,
          inq.name,
          inq.phone,
          inq.email,
          inq.product,
          inq.budget,
          inq.priority,
          inq.message,
          inq.status,
          inq.notes,
          inq.createdAt
        ]
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'MySQL table successfully wiped and seeded with default data!',
      count: SEED_INQUIRIES.length
    }, { status: 200 });
  } catch (error) {
    console.error('API Error in Seeding database:', error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

