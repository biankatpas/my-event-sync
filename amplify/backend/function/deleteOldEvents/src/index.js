/* Amplify Params - DO NOT EDIT
	ENV
	REGION
	STORAGE_DYNAMO3EBF100B_ARN
	STORAGE_DYNAMO3EBF100B_NAME
	STORAGE_DYNAMO3EBF100B_STREAMARN
Amplify Params - DO NOT EDIT */

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */

const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = "event-dev";

exports.handler = async (event) => {
  const today = new Date().toISOString().split('T')[0];

  const params = {
    TableName: TABLE_NAME,
    FilterExpression: "#dt < :today",
    ExpressionAttributeNames: {
      "#dt": "date"
    },
    ExpressionAttributeValues: {
      ":today": today
    }
  };

  try {
    const result = await dynamoDb.scan(params).promise();
    const deletePromises = result.Items.map(item => {
      const delParams = {
        TableName: TABLE_NAME,
        Key: { id: item.id }
      };
      return dynamoDb.delete(delParams).promise();
    });
    await Promise.all(deletePromises);
    return { statusCode: 200, body: JSON.stringify({ message: "Old events deleted" }) };
  } catch (error) {
    console.error("Error cleaning old events:", error);
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
