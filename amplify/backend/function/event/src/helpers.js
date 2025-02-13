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
      title: data.title.toUpperCase(),
      description: data.description,
      guests: data.guests,
      date: data.date,
      time: data.time,
      owner: data.owner
    }
  };

  await dynamoDb.put(params).promise();
  return buildResponse(200, { message: "Event added successfully." });
};

const editEvent = async (data) => {
  if (!data || !data.id || !data.title || !data.description || !data.guests || !data.date || !data.time) {
    throw new Error("Invalid event data. Must include id, title, description, guests, date, and time.");
  }
  
  const params = {
    TableName: TABLE_NAME,
    Key: {
      id: data.id
    },
    UpdateExpression: "set title = :t, description = :d, guests = :g, #dt = :dt, #tm = :tm",
    ExpressionAttributeNames: {
      "#dt": "date",
      "#tm": "time"
    },
    ExpressionAttributeValues: {
      ":t": data.title.toUpperCase(),
      ":d": data.description,
      ":g": data.guests,
      ":dt": data.date,
      ":tm": data.time
    },
    ReturnValues: "ALL_NEW"
  };

  const result = await dynamoDb.update(params).promise();
  return buildResponse(200, { message: "Event updated successfully.", updated: result.Attributes });
};

const listEvents = async () => {
  const params = {
    TableName: TABLE_NAME,
  };

  const result = await dynamoDb.scan(params).promise();

  const sortedItems = result.Items.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    const dateDiff = dateA - dateB;

    if (dateDiff !== 0) {
      return dateDiff;
    }

    const [aHour, aMinute] = a.time.split(':').map(Number);
    const [bHour, bMinute] = b.time.split(':').map(Number);
    const timeA = aHour * 60 + aMinute;
    const timeB = bHour * 60 + bMinute;
    return timeA - timeB;
  });

  return buildResponse(200, sortedItems);
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

module.exports = { addEvent, editEvent, listEvents, removeEvent, buildResponse };
