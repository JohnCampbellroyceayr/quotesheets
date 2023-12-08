import mysqlQuery from '../databases/mysqlconnection.js';

export async function updateItem(obj) {
    const id = obj["ID"];
    const type = obj["TYPE"];
    const price = obj["PRICE"];
    const quantity = obj["QUANTITY"];
    const quoteId = obj["QUOTE"];
    const description = obj["DESCRIPTION"];
    const custom = JSON.stringify(obj["CUSTOM"]);
    if(id == undefined || id == "") {
        addItem(type, price, quantity, quoteId, description, custom);
    }
    else {
        const item = await mysqlQuery('SELECT * FROM Items WHERE id = ?;', id);
        if(item.error) {
            return [];
        }
        else {
            if(result.length > 0) {
                await editItem(id, type, price, quantity, quoteId, description, custom);
            }
            else {
                await addItem(type, price, quantity, quoteId, description, custom);
            }
        }    
    }
}

async function addItem(type, price, quantity, quoteId, description, custom) {
    const itemResult = await mysqlQuery('INSERT INTO Items (type, price, quantity, quote, description, custom) VALUES (?, ?, ?, ?, ?, ?);', [type, price, quantity, quoteId, description, custom]);
    return itemResult;
}

async function editItem(id, type, price, quantity, quoteId, description, custom) {
    const itemResult = await mysqlQuery('UPDATE Items SET type = ?, price = ?, quantity = ?, quote = ?, description = ?, custom = ? WHERE id = ?;', [type, price, quantity, quoteId, description, custom, id]);
    return itemResult;
}