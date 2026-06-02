import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { filePath } = await request.json(); // e.g. "/rohini/image.jpg"

    if (!filePath) {
      return NextResponse.json({ success: false, error: 'Missing file path' }, { status: 400 });
    }

    // Secure the path
    const safePath = path.normalize(filePath).replace(/^(\.\.[\/\\])+/, '');
    // Ensure it starts with public
    const absolutePath = path.join(process.cwd(), 'public', safePath);

    if (fs.existsSync(absolutePath)) {
      fs.unlinkSync(absolutePath);
      return NextResponse.json({ success: true, message: 'File deleted successfully' });
    } else {
      return NextResponse.json({ success: false, error: 'File not found' }, { status: 404 });
    }

  } catch (error) {
    console.error('Delete Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
