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

export async function getQuoteName(name, offset, limit) {
  return new Promise((resolve, reject) => {
    const searchName = isNaN(name) ? "%" + name.toLowerCase() + "%" : "%" + name + "%";
    const query = `
      SELECT *
      FROM Quotes
      WHERE LOWER(customer_name) LIKE ?;
    `;
    mysql.query(query, [searchName], (err, result) => {
      if (err) {
        reject(err);
      }
      resolve(result.slice(offset, limit + offset));
    });
  });
}

export async function getQuoteIndex(offset, limit) {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT *
      FROM Quotes
      LIMIT ? OFFSET ?
    `;
    mysql.query(query, [limit, offset], (err, result) => {
      resolve(result);
    });
  });
}

export async function getAllQuotes() {
  return new Promise((resolve, reject) => {
    mysql.query('SELECT * FROM Quotes;', (err, result) => {
      if (err) {
        reject(err);
      } else if (result.length > 0) {
        resolve(result);
      } else {
        resolve(false);
      }
    });
  });
}


export async function deleteQuote(id) {
  return new Promise((resolve, reject) => {
    mysql.query('DELETE FROM Quotes WHERE id = ?;', [id], (err, result) => {
      if (err) {
        reject(err);
      } resolve(true);
    });
  });
}