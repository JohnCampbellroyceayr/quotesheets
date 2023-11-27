import connectMysql from '../databases/mysqlconnection.js';
const mysql = await connectMysql();

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
        mysql.query('SELECT * FROM Items WHERE id = ?;', id, (err, result) => {
            if(err) {
                console.log(err);
            }
            else {
                if(result.length > 0) {
                    editItem(id, type, price, quantity, quoteId, description, custom);
                }
                else {
                    addItem(type, price, quantity, quoteId, description, custom);
                }
            }
        });
    }
}

function addItem(type, price, quantity, quoteId, description, custom) {
    mysql.query('INSERT INTO Items (type, price, quantity, quote, description, custom) VALUES (?, ?, ?, ?, ?, ?);', [type, price, quantity, quoteId, description, custom], (err, result) => {
        if(err) {
            console.log(err);
        }
    });
}

function editItem(id, type, price, quantity, quoteId, description, custom) {
    mysql.query('UPDATE Items SET type = ?, price = ?, quantity = ?, quote = ?, description = ?, custom = ? WHERE id = ?;', [type, price, quantity, quoteId, description, custom, id], (err, result) => {
        if(err) {
            console.log(err);
        }
    });
}