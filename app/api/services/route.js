import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';

export async function GET() {
  try {
    const publicDir = path.join(process.cwd(), 'public');
    
    const services = {
      'Manufacturing Services': {},
      'Publicity Services': {}
    };

    // Helper function to read a directory and get all its subdirectories' images
    const populateCategory = (categoryName) => {
      const categoryPath = path.join(publicDir, categoryName);
      if (fs.existsSync(categoryPath)) {
        const subDirs = fs.readdirSync(categoryPath, { withFileTypes: true })
          .filter(dirent => dirent.isDirectory())
          .map(dirent => dirent.name);

        subDirs.forEach(subDir => {
          const subDirPath = path.join(categoryPath, subDir);
          const images = fs.readdirSync(subDirPath)
            .filter(file => /\.(png|jpe?g|webp|gif|svg)$/i.test(file))
            .map(file => `/${categoryName}/${subDir}/${file}`);
          
          services[categoryName][subDir] = images;
        });
      }
    };

    populateCategory('Manufacturing Services');
    populateCategory('Publicity Services');

    // Fetch and merge additional products from MySQL database (Cloudinary URLs)
    const dbProducts = await executeQuery('SELECT * FROM products ORDER BY id ASC');
    dbProducts.forEach(row => {
      const { category, subcategory, imageUrl } = row;
      if (services[category] !== undefined) {
        if (!services[category][subcategory]) {
          services[category][subcategory] = [];
        }
        if (!services[category][subcategory].includes(imageUrl)) {
          services[category][subcategory].push(imageUrl);
        }
      }
    });

    return NextResponse.json(services);
  } catch (error) {
    console.error('Error reading service directories:', error);
    return NextResponse.json({ error: 'Failed to load services' }, { status: 500 });
  }
}

