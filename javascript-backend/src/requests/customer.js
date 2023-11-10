import { query } from 'express';
import connectODBC from '../databases/odbcconnection.js';
const ODBC = await connectODBC();

export async function getCustomerName(name, limit, offset) {
    return new Promise((resolve, reject) => {
        const searchName = "%" + name.toLowerCase() + "%";
        const query = "SELECT TRIM(BVNAME) FROM CUST WHERE LOWER(BVNAME) LIKE ? ORDER BY BVNAME OFFSET ? ROWS FETCH NEXT ? ROWS ONLY";
        ODBC.query(query, [searchName, offset, limit], (error, result) => {
            if (error) {
                console.error(error);
                reject(error);
                return;
            }
            const nameArr = [];
            for (let i = 0; i < result.length; i++) {
                const name = result[i];
                nameArr.push(name["00001"]);
            }
            resolve(nameArr);
        });
    });
}

export async function getCustomerIndex(name, limit) {
    return new Promise((resolve, reject) => {
        const searchName = name.toLowerCase();
        const query = `
            SELECT TRIM(BVNAME) FROM CUST
            OFFSET ? ROWS
            FETCH NEXT ? ROWS ONLY
        `;
        ODBC.query(query, [name, limit], (error, result) => {
            if (error) {
                console.error(error);
                reject(error);
                return;
            }
            const nameArr = [];
            for (let i = 0; i < result.length; i++) {
                const name = result[i];
                nameArr.push(name["00001"]);
                console.log(name);
            }
            resolve(nameArr);
        });
    });
}