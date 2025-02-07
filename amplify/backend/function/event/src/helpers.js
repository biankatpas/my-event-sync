// helpers.js
const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = "event-dev";

const buildResponse = (statusCode, body) => {
  return {
    statusCode: statusCode,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    },
    body: JSON.stringify(body)
  };
};

const addEvent = async (data) => {
  if (!data || !data.title || !data.description || !data.guests || !data.date || !data.time) {
    throw new Error("Invalid event data. Must include title, description, guests, date, and time.");
  }
  
  const params = {
    TableName: TABLE_NAME,
    Item: {
      id: uuidv4(),
      title: data.title,
      description: data.description,
      guests: data.guests,
      date: data.date,
      time: data.time,
    }
  };

  await dynamoDb.put(params).promise();
  return buildResponse(200, { message: "Event added successfully." });
};

const listEvents = async () => {
  const params = {
    TableName: TABLE_NAME,
  };

  const result = await dynamoDb.scan(params).promise();
  return buildResponse(200, result.Items);
};

const removeEvent = async (id) => {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      id: id
    },
  };

  await dynamoDb.delete(params).promise();
  return buildResponse(200, { message: "Event removed successfully." });
};

module.exports = { addEvent, listEvents, removeEvent, buildResponse };
