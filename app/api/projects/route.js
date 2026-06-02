import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function GET() {
  const imagesDir = path.join(process.cwd(), 'public', 'rohini');
  
  try {
    if (!fs.existsSync(imagesDir)) {
      return NextResponse.json({ images: [] });
    }

    const files = fs.readdirSync(imagesDir);
    
    // Filter for image files
    const imageFiles = files
      .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
      .map(file => `/rohini/${file}`);

    return NextResponse.json({ images: imageFiles });
  } catch (error) {
    console.error('Failed to read rohini directory:', error);
    return NextResponse.json({ images: [] }, { status: 500 });
  }
}
