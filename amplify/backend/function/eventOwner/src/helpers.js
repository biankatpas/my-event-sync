const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

const TABLE_NAME = 'owner-dev';

const listItems = async () => {
  const params = {
    TableName: TABLE_NAME,
  };

  try {
    const result = await dynamoDb.scan(params).promise();
    return result.Items;
  } catch (error) {
    console.error('Erro ao listar itens:', error);
    throw error;
  }
};

module.exports = { listItems };
