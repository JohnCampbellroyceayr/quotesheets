import mysqlQuery from '../databases/mysqlconnection.js';

export async function getAllParts() {
  const queryResult = await mysqlQuery('SELECT * FROM Parts;');
  return queryResult;
}

export async function addPart(name, description) {

  const addResult = await mysqlQuery('INSERT INTO Parts (name, description) VALUES (?, ?);', [name, description]);

  if(addResult.error === true) {
    return { message: "Failed to create part" };
  }

  const newPartId = addResult.result.insertId;
  const typeLetter = 'Q';

  const setTypeIdResult = await mysqlQuery("UPDATE Parts SET type = CONCAT(?, ?) WHERE id = ?;", [typeLetter, newPartId, newPartId]);

  if(setTypeIdResult.error === true) {
    return { message: "Failed to create part" };
  }

  return {
    message: createSuccessMessage(typeLetter, newPartId, name, description)
  };
}

function createSuccessMessage(letter, partId, name, description) {
  let successMessage = "Successfully created part: \n";
  successMessage += `Id: ${letter + partId} \n`;
  successMessage += `Name: ${name} \n`;
  successMessage += `Description: ${description} \n`;
  return successMessage;
}