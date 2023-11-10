import connectMysql from '../databases/mysqlconnection.js';
const mysql = await connectMysql();

export async function getQuote(id) {
    return new Promise((resolve, reject) => {
      mysql.query('SELECT * FROM Quotes WHERE id = ?;', id, (err, result) => {
        if (err) {
          reject(err);
        } else if (result.length > 0) {
          resolve(result[0]);
        } else {
          resolve(false);
        }
      });
    });
}