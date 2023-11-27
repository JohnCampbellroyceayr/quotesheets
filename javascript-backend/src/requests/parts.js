import connectMysql from '../databases/mysqlconnection.js';
const mysql = await connectMysql();

export async function getAllParts(id) {
  return new Promise((resolve, reject) => {
    mysql.query('SELECT * FROM Parts;', id, (err, parts) => {
      if (err) {
        reject(err);
      } 
      else {
        resolve(parts);
      }
    });
  });
}

export async function addPart(name, description) {
  return new Promise((resolve, reject) => {
    mysql.query('INSERT INTO Parts (name, description) VALUES (?, ?);', [name, description], (err, parts) => {
      if (err) {
        reject(err);
      }
      else {
          const setTypeQuery = `
              UPDATE Parts AS a
              INNER JOIN (
              SELECT id FROM Parts ORDER BY id DESC LIMIT 1
              ) AS b ON a.id = b.id
              SET a.type = CONCAT('Q', a.id);
          `;
          mysql.query(setTypeQuery, (err, res2) => {
              resolve(true);
          });
          resolve(false);
      }
    });
  });
}