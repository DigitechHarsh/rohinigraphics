import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { executeQuery } from '@/lib/db';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request) {
  try {
    const { filePath } = await request.json(); // e.g. "/rohini/image.jpg" or "https://res.cloudinary.com/..."

    if (!filePath) {
      return NextResponse.json({ success: false, error: 'Missing file path' }, { status: 400 });
    }

    // Check if it's a Cloudinary URL (starts with http/https)
    if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
      // 1. Look up in products table
      let dbResult = await executeQuery('SELECT publicId FROM products WHERE imageUrl = ?', [filePath]);
      let isProduct = true;

      // 2. If not found, look up in projects table
      if (dbResult.length === 0) {
        dbResult = await executeQuery('SELECT publicId FROM projects WHERE imageUrl = ?', [filePath]);
        isProduct = false;
      }

      if (dbResult.length > 0) {
        const publicId = dbResult[0].publicId;

        // 3. Delete from Cloudinary
        const cloudResult = await cloudinary.uploader.destroy(publicId);

        // 4. Delete from MySQL database
        if (isProduct) {
          await executeQuery('DELETE FROM products WHERE imageUrl = ?', [filePath]);
        } else {
          await executeQuery('DELETE FROM projects WHERE imageUrl = ?', [filePath]);
        }

        return NextResponse.json({ success: true, message: 'File deleted successfully from Cloudinary and database' });
      } else {
        return NextResponse.json({ success: false, error: 'Image record not found in database' }, { status: 404 });
      }
    } else {
      // It's a local filesystem file
      const safePath = path.normalize(filePath).replace(/^(\.\.[\/\\])+/, '');
      const absolutePath = path.join(process.cwd(), 'public', safePath);

      if (fs.existsSync(absolutePath)) {
        fs.unlinkSync(absolutePath);
        return NextResponse.json({ success: true, message: 'Local file deleted successfully' });
      } else {
        return NextResponse.json({ success: false, error: 'Local file not found' }, { status: 404 });
      }
    }

  } catch (error) {
    console.error('Delete Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

