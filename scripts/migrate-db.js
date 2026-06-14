const { MongoClient } = require('mongodb');
const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.local' });

async function migrate() {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.error('Error: MONGODB_URI is not defined in .env.local');
    process.exit(1);
  }

  const mysqlConfig = {
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    port: parseInt(process.env.MYSQL_PORT || '3306')
  };

  if (!mysqlConfig.host || !mysqlConfig.user || !mysqlConfig.database) {
    console.error('Error: MySQL environment variables (MYSQL_HOST, MYSQL_USER, MYSQL_DATABASE) are not defined in .env.local');
    process.exit(1);
  }

  console.log('Connecting to MongoDB...');
  const mongoClient = new MongoClient(mongoUri);
  await mongoClient.connect();
  const mongoDb = mongoClient.db();
  const inquiriesCollection = mongoDb.collection('inquiries');
  
  console.log('Connecting to MySQL...');
  const mysqlConnection = await mysql.createConnection(mysqlConfig);

  console.log('Ensuring target MySQL table exists...');
  await mysqlConnection.execute(`
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

  console.log('Fetching inquiries from MongoDB...');
  const mongoInquiries = await inquiriesCollection.find({}).toArray();
  console.log(`Found ${mongoInquiries.length} inquiries in MongoDB.`);

  let migratedCount = 0;
  for (const inq of mongoInquiries) {
    try {
      // Handle missing or differently formatted fields
      const inquiryId = inq.inquiryId || `INQ-${Math.floor(1000 + Math.random() * 9000)}`;
      const name = inq.name;
      const phone = inq.phone;
      const email = inq.email || 'Not Provided';
      const product = inq.product;
      const budget = inq.budget || 'Not Specified';
      const priority = inq.priority || 'Normal';
      const message = inq.message;
      const status = inq.status || 'Pending';
      const notes = inq.notes || '';
      const createdAt = inq.createdAt ? new Date(inq.createdAt) : new Date();

      await mysqlConnection.execute(
        `INSERT INTO inquiries (inquiryId, name, phone, email, product, budget, priority, message, status, notes, createdAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
           name = VALUES(name),
           phone = VALUES(phone),
           email = VALUES(email),
           product = VALUES(product),
           budget = VALUES(budget),
           priority = VALUES(priority),
           message = VALUES(message),
           status = VALUES(status),
           notes = VALUES(notes),
           createdAt = VALUES(createdAt)`,
        [inquiryId, name, phone, email, product, budget, priority, message, status, notes, createdAt]
      );
      migratedCount++;
    } catch (err) {
      console.error(`Failed to migrate inquiry ID ${inq._id || inq.inquiryId}:`, err.message);
    }
  }

  console.log(`Migration completed! Successfully migrated/updated ${migratedCount} out of ${mongoInquiries.length} inquiries.`);
  
  await mongoClient.close();
  await mysqlConnection.end();
}

migrate().catch(console.error);
