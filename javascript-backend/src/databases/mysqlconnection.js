import mysql from 'mysql2';
import { promisify } from 'util';

function connectMysql() {
  return new Promise((resolve, reject) => {
    const pool = mysql.createPool({
      host: '127.0.0.1',
      user: 'quotesheet',
      password: 'zMVIIbwJohn',
      database: 'QUOTE_SHEETS',
      connectionLimit: 100
    });
 
    const getConnection = promisify(pool.getConnection).bind(pool);
 
    getConnection()
      .then(connection => {
        console.log('Connected to MySQL');
        connection.release();
        resolve(pool);
      })
      .catch(err => {
        console.error('Error connecting to MySQL:', err);
        reject(err);
      });
  });
}

let connection = await connectMysql();

export default async function sqlQuery(query, args = []) {
  return new Promise((resolve) => {
    connection.query(query, args, (err, result) => {
      if(err) {
        resolve({
          error: true,
		  result: err
        });
      }
      else {
        resolve({
			error: false,
			result: result
		});
      }
    });
  });
}