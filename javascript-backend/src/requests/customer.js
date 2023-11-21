import connectODBC from '../databases/odbcconnection.js';
import connectMysql from '../databases/mysqlconnection.js';
const ODBC = await connectODBC();
const mysql = await connectMysql();

export async function getCustomerName(name, limit, offset) {
    return new Promise((resolve, reject) => {
        
        const searchName = isNaN(name) ? "%" + name.toLowerCase() + "%" : "%" + name + "%";
        const query = `
            SELECT TRIM(BVNAME) AS NAME, TRIM(BVCUST) AS NUMBER, BVTYPE AS TYPE,
                TRIM(BVADR1),
                TRIM(BVADR2),
                TRIM(BVADR3),
                TRIM(BVADR4),
                TRIM(BVADR5),
                TRIM(BVADR6),
                TRIM(BVADR7),
                TRIM(BVADR8),
                TRIM(BVADR9),
                TRIM(BVADR10),
                TRIM(BVPOST)
            FROM CUST 
            WHERE LOWER(BVNAME) LIKE ? 
            ORDER BY LOWER(TRIM(BVNAME))
        `;
        ODBC.query(query, [searchName], (error, result) => {
            if (error) {
                console.error(error);
                reject(error);
                return;
            }
            const custArr = [];
            for (let i = 0; i < result.length; i++) {
                custArr.push({
                    name: result[i]["NAME"],
                    number: result[i]["NUMBER"],
                    address: makeAddress(result[i]),
                    type: (result[i]["TYPE"] == "S") ? "" : result[i]["TYPE"]
                });
            }
            const selectFields = `
                TRIM(Name) AS NAME, TRIM(Customer_Number) AS NUMBER,
                TRIM(Address),
                TRIM(City),
                TRIM(Country),
                TRIM(Postal_Code)
            `;
            const mysqlQuery = 'SELECT ' + selectFields + ' FROM New_Customers WHERE Name LIKE ?;';
            const vals = [searchName];
            mysql.query(mysqlQuery, vals, (err, res) => {
                if (err) {
                    console.log(err);
                    reject(err);
                } else if (res.length > 0) {
                    const newcustArr = [];
                    for (let i = 0; i < res.length; i++) {
                        newcustArr.push({
                            name: res[i]["NAME"],
                            number: res[i]["NUMBER"],
                            address: makeAddress(res[i])
                        });
                    }
                    resolve(mergeArrays(custArr, newcustArr, offset, limit));
                } else {
                    resolve(custArr.slice(offset, limit + offset));
                }
            });
        });
    });
}

export async function getCustomerIndex(index, limit) {
    return new Promise((resolve, reject) => {
        let query = `
            SELECT TRIM(BVNAME) AS NAME, TRIM(BVCUST) AS NUMBER, BVTYPE AS TYPE,
                TRIM(BVADR1),
                TRIM(BVADR2),
                TRIM(BVADR3),
                TRIM(BVADR4),
                TRIM(BVADR5),
                TRIM(BVADR6),
                TRIM(BVADR7),
                TRIM(BVADR8),
                TRIM(BVADR9),
                TRIM(BVADR10),
                TRIM(BVPOST)
            FROM CUST
            ORDER BY LOWER(TRIM(BVNAME))
            OFFSET ? ROWS
            FETCH NEXT ? ROWS ONLY
        `;
        const searchIndex = (index > 0) ? index - 1 : 0;
        ODBC.query(query, [searchIndex, limit], (error, result) => {
            if (error) {
                console.error(error);
                reject(error);
                return;
            }
            const custArr = [];
            for (let i = 0; i < result.length; i++) {
                custArr.push({
                    name: result[i]["NAME"],
                    number: result[i]["NUMBER"],
                    address: makeAddress(result[i]),
                    type: (result[i]["TYPE"] == "S") ? "" : result[i]["TYPE"]
                });
            }
            if(custArr.length == 0) {
                resolve([]);
            }
            else {
                const selectFields = `
                    TRIM(Name) AS NAME, TRIM(Customer_Number) AS NUMBER,
                    TRIM(Address),
                    TRIM(City),
                    TRIM(Country),
                    TRIM(Postal_Code)
                `;
                const mysqlQuery = (custArr.length < limit) ? 'SELECT ' + selectFields + ' FROM New_Customers WHERE LOWER(Name) <= ?;' : 'SELECT ' + selectFields + ' FROM New_Customers WHERE Name BETWEEN ? AND ?;';
                const vals = (custArr.length < limit) ? [custArr[0].name] : [custArr[0].name, custArr[custArr.length - 1].name];
                mysql.query(mysqlQuery, vals, (err, res) => {
                    if (err) {
                        console.log(err);
                        reject(err);
                    } else if (res.length > 0) {
                        const newcustArr = [];
                        for (let i = 0; i < res.length; i++) {
                            newcustArr.push({
                                name: res[i]["NAME"],
                                number: res[i]["NUMBER"],
                                address: makeAddress(res[i])
                            });
                        }
                        resolve(mergeArrays(custArr, newcustArr, (index == 0) ? 0 : 1, limit));
                    } else {
                        resolve(custArr);
                    }
                });
            }
        });
    });
}

function makeAddress(obj) {
    let addressString = '';

    for (let prop in obj) {
        if (prop !== 'NAME' && prop !== 'NUMBER' && prop !== 'TYPE' && obj[prop] != '') {
            addressString += obj[prop] + ' ';
        }
    }

    return addressString.trim();
}

function mergeArrays(arr1, arr2, offset, limit) {
    var mergedArray = arr1.concat(arr2);
    mergedArray.sort((a, b) => a.name.localeCompare(b.name, undefined, {sensitivity: 'base'}));
    return mergedArray.slice(offset, limit + offset);
}


export async function addCustomer(custObj) {
    return new Promise((resolve, reject) => {
        const values = getNewCustomerValues(custObj);
        const query = `
            INSERT INTO New_Customers 
            (Name, Address, City, Country, Postal_Code, Currency, Contact_Phone, Contact_Email) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?);
        `;
        mysql.query(query, values, (err, res) => {
            const query2 = `
                UPDATE New_Customers AS a
                INNER JOIN (
                SELECT id FROM New_Customers ORDER BY id DESC LIMIT 1
                ) AS b ON a.id = b.id
                SET a.Customer_Number = CONCAT('NEW##', a.id);
            `;
            mysql.query(query2, values, (err, res2) => {
                resolve(true);
            });
        });
    });
}

function getNewCustomerValues(custObj) {
    return [
        custObj["name"],
        custObj["address"],
        custObj["city"],
        custObj["country"],
        custObj["postal code"],
        custObj["currency"],
        custObj["contact name"],
        custObj["contact phone"],
        custObj["contact email"]
    ]
}