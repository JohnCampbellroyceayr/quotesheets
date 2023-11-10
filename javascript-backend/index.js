import express from "express";
// import connectMysql from "./src/databases/mysqlconnection.js";
// import connectODBC from "./src/databases/odbcconnection.js";

import { getQuote } from "./src/requests/quote.js";
import { getCustomerName, getCustomerIndex } from "./src/requests/customer.js"

// const mysql = await connectMysql();
// const ODBC = await connectODBC();

// console.log(ODBC);
// ODBC.query('SELECT BVNAME FROM CUST', (error, result) => {
//     if (error) {
//         console.error(error);
//         return;
//     }
//     let str = '';
//     result.forEach(line => {
//         str += line["BVNAME"] + '\n';
//     });
//     fs.writeFileSync("./output.txt", str);
//     // console.log(result);
// });


// const quote = {
//     customer_number: 'John01',
//     customer_name: 'John Campbell',
//     customer_address: '1223 Road, Strathroy, Ontario, Canada',
//     items: JSON.stringify([1, 2]),
//     description: 'A quote for mr. Campbell',
//     custom: JSON.stringify({ PartNumberFace: 'John is good' })
// };

// mysql.query('INSERT INTO Quotes SET ?', quote, (err, result) => {
//     if (err) throw err;
//     console.log('Quote inserted successfully!');
//     console.log(result);
//     // connection.end();
// });

const app = express();
import cors from 'cors';

app.use(cors());
app.use(express.json());

app.post('/test', (req, res) => {
 console.log(req.body);
 res.json({
    "Success": true
 });
});

// app.get('/api/customer/name/:id', async (req, res) => {
//     const customerId = req.params.id;
//     const custList = await getCustomerName(customerId, 20, 20);
//     console.log(custList);
//     res.json(custList);
// });

app.post('/api/customer/name', async (req, res) => {
    const name = req.body.name;
    const limit = req.body.limit;
    const offset = req.body.offset;
    if(offset >= 0 && limit > 0) {
        const custList = await getCustomerName(name, limit, offset);
        console.log(custList);
        res.json(custList);
    }
    else {
        res.json([]);
    }
});

app.get('/api/customer/index/:id', async (req, res) => {
    const customerIndex = req.params.id;
    const custList = await getCustomerIndex(customerIndex, 20);
    res.json(custList);
});

app.get('/api/quote/:id', async (req, res) => {
    const quoteId = req.params.id;
    const quote = await getQuote(quoteId);
    res.json(quote);
});

app.listen(2000, () => {
    console.log('Server is running on port 2000');
});