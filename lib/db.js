import mysql from 'mysql2/promise';

let pool;

async function ensureTablesExist(poolConnection) {
  try {
    await poolConnection.execute(`
      CREATE TABLE IF NOT EXISTS inquiries (
          id INT AUTO_INCREMENT PRIMARY KEY,
          inquiryId VARCHAR(20) UNIQUE NOT NULL,
          name VARCHAR(255) NOT NULL,
          phone VARCHAR(50) NOT NULL,
          email VARCHAR(255) DEFAULT 'Not Provided',
          product VARCHAR(255) NOT NULL,
          budget VARCHAR(100) DEFAULT 'Not Specified',
          priority ENUM('Low', 'Normal', 'Medium', 'High') DEFAULT 'Normal',
          message TEXT NOT NULL,
          status ENUM('Pending', 'Contacted', 'Completed') DEFAULT 'Pending',
          notes TEXT DEFAULT NULL,
          createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await poolConnection.execute(`
      CREATE TABLE IF NOT EXISTS products (
          id INT AUTO_INCREMENT PRIMARY KEY,
          category VARCHAR(255) NOT NULL,
          subcategory VARCHAR(255) NOT NULL,
          imageUrl VARCHAR(2048) NOT NULL,
          publicId VARCHAR(255) NOT NULL,
          createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await poolConnection.execute(`
      CREATE TABLE IF NOT EXISTS projects (
          id INT AUTO_INCREMENT PRIMARY KEY,
          imageUrl VARCHAR(2048) NOT NULL,
          publicId VARCHAR(255) NOT NULL,
          createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
  } catch (error) {
    console.error('Error creating database tables:', error.message);
  }
}

export default async function dbConnect() {
  if (pool) return pool;

  pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    port: parseInt(process.env.MYSQL_PORT || '3306'),
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  // Ensure tables exist on startup and wait for it
  await ensureTablesExist(pool);

  return pool;
}

export async function executeQuery(query, values = []) {
  const connectionPool = await dbConnect();
  const [results] = await connectionPool.execute(query, values);
  return results;
}

