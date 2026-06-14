import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { executeQuery } from '@/lib/db';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper to upload buffer to Cloudinary
const uploadToCloudinary = (fileBuffer, folderName) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: folderName },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    uploadStream.end(fileBuffer);
  });
};

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

    // Upload directly to Cloudinary
    const uploadResult = await uploadToCloudinary(buffer, folder);

    const imageUrl = uploadResult.secure_url;
    const publicId = uploadResult.public_id;

    // Save metadata in MySQL database based on target folder
    if (folder.includes('Manufacturing Services') || folder.includes('Publicity Services')) {
      // It's a product
      const parts = folder.split('/');
      const category = parts[0];
      const subcategory = parts[1] || 'Default';

      await executeQuery(
        'INSERT INTO products (category, subcategory, imageUrl, publicId) VALUES (?, ?, ?, ?)',
        [category, subcategory, imageUrl, publicId]
      );
    } else if (folder === 'rohini') {
      // It's a project
      await executeQuery(
        'INSERT INTO projects (imageUrl, publicId) VALUES (?, ?)',
        [imageUrl, publicId]
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: 'File uploaded successfully to Cloudinary and database',
      path: imageUrl
    });

  } catch (error) {
    console.error('Upload Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

