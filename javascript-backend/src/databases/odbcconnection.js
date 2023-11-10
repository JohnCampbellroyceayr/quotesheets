import odbc from 'odbc';

export default async function connectODBC() {
  return new Promise((resolve, reject) => {
    odbc.connect(`DSN=AS400;SYSTEM=192.168.0.200;UID=JCAMP;PWD=JCAMP;`, (error, conn) => {
      if (error) {
        console.error(error);
        reject(error);
      } else {
        console.log("Connected To ODBC");
        resolve(conn);
      }
    });
  });
}