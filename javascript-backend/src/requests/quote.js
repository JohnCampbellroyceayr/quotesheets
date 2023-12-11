import mysqlQuery from '../databases/mysqlconnection.js';
// const mysql = await connectMysql();

export async function getQuote(id) {

  const quotes = await mysqlQuery('SELECT * FROM Quotes WHERE id = ?;', id);
  if(quotes.error) {
    return {
      header: [],
      items: []
    };
  }
  else {
    const itemQuery = `
      SELECT Items.*, 
        Parts.name AS name
      FROM Items 
      JOIN Parts ON Items.type = Parts.type
      WHERE Items.quote = ?
      ORDER BY Items.id ASC;
    `;
    const items = await mysqlQuery(itemQuery, id);
    if(items.error) {
      return {
        header: [],
        items: []
      };
    }
    else {
      return ({
        header: quotes.result,
        items: items.result,
      });
    }
  }
}

export async function getQuoteName(name, offset, limit) {
    const searchName = isNaN(name) ? "%" + name.toLowerCase() + "%" : "%" + name + "%";
    const query = `
      SELECT *
      FROM Quotes
      WHERE LOWER(customer_name) LIKE ?;
    `;
    const result = await mysqlQuery(query, [searchName]);
    if (result.error) {
      return [];
    }
    return result.result.slice(offset, limit + offset);
}

export async function getQuoteIndex(offset, limit) {
  const query = `
    SELECT *
    FROM Quotes
    LIMIT ? OFFSET ?
  `;
  const result = await mysqlQuery(query, [limit, offset]);
  return result.result;
}

export async function getAllQuotes() {
  const result = await mysqlQuery('SELECT * FROM Quotes;');
  if (result.error) {
    return false;
  } else if (result.result.length > 0) {
    return result.result;
  } else {
    return false;
  }
}


export async function deleteQuote(id) {
  const result = await mysqlQuery('DELETE FROM Quotes WHERE id = ?;', [id]);
    if (result.error) {
      return false;
    }
    else {
      return true;
    }
}