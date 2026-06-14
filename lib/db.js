import mysql from 'mysql2/promise';

let pool;

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

  return pool;
}

export async function executeQuery(query, values = []) {
  const connectionPool = await dbConnect();
  const [results] = await connectionPool.execute(query, values);
  return results;
}

