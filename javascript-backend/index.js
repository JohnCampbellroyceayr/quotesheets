import express from "express";
import connectMysql from "./src/databases/mysqlconnection.js";
import connectODBC from "./src/databases/odbcconnection.js";
import fs from 'fs';

const mysql = await connectMysql();
const ODBC = await connectODBC();
// console.log(ODBC);
ODBC.query('SELECT BVNAME FROM CUST', (error, result) => {
    if (error) {
        console.error(error);
        return;
    }
    let str = '';
    result.forEach(line => {
        str += line["BVNAME"] + '\n';
    });
    fs.writeFileSync("./output.txt", str);
    // console.log(result);
});


mysql.query('SHOW TABLES;', (error, result) => {
    if (error) {
        console.error(error);
        return;
    }
    let str = '';
    result.forEach(line => {
        str += line["BVNAME"] + '\n';
    });
    console.log(result);
});

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

app.get('/api/customer/:id', (req, res) => {
    const customerId = req.params.id;
    res.json({
        "Hello": 12,
        "Hello2": 12,
        "number": customerId
    });
});

app.listen(2000, () => {
    console.log('Server is running on port 2000');

});


