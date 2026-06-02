import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const folder = formData.get('folder'); // e.g. "rohini" or "Manufacturing Services/Acrylic Letter"

    if (!file || !folder) {
      return NextResponse.json({ success: false, error: 'Missing file or folder path' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Secure the upload path
    const safeFolder = path.normalize(folder).replace(/^(\.\.[\/\\])+/, '');
    const uploadDir = path.join(process.cwd(), 'public', safeFolder);

    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Generate unique filename to avoid overwriting
    const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.\-_]/g, '')}`;
    const filePath = path.join(uploadDir, fileName);

    fs.writeFileSync(filePath, buffer);

    return NextResponse.json({ 
      success: true, 
      message: 'File uploaded successfully',
      path: `/${safeFolder.replace(/\\/g, '/')}/${fileName}`
    });

  } catch (error) {
    console.error('Upload Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
