import mysql from 'mysql2';

export default async function connectMysql() {
  const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'quotesheet',
    password: 'zMVIIbwJohn',
    database: 'QUOTE_SHEETS'
  });
  
  connection.connect((err) => {
    if (err) {
      console.error('Error connecting to MySQL:', err);
    } else {
      console.log('Connected to MySQL');
    }
  });
  return connection;
}