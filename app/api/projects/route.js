import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const imagesDir = path.join(process.cwd(), 'public', 'rohini');
  let imageFiles = [];
  
  try {
    // 1. Read from local filesystem if exists
    if (fs.existsSync(imagesDir)) {
      const files = fs.readdirSync(imagesDir);
      imageFiles = files
        .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
        .map(file => `/rohini/${file}`);
    }

    // 2. Read from MySQL database (Cloudinary URLs)
    const dbProjects = await executeQuery('SELECT * FROM projects ORDER BY id DESC');
    const dbUrls = dbProjects.map(row => row.imageUrl);

    // Merge lists
    const combinedImages = [...dbUrls, ...imageFiles];

    return NextResponse.json({ images: combinedImages });
  } catch (error) {
    console.error('Failed to read rohini directory:', error);
    return NextResponse.json({ images: [] }, { status: 500 });
  }
}

