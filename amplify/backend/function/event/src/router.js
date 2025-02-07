// router.js
const { addEvent, editEvent, listEvents, removeEvent, buildResponse } = require('./helpers');

exports.handleRequest = async (event) => {
  console.log("Received event:", JSON.stringify(event));

  try {
    switch (event.httpMethod) {
      case 'GET':
        return await listEvents();
      case 'POST':
        const eventData = JSON.parse(event.body);
        return await addEvent(eventData);
      case 'DELETE':
        const eventId = event.queryStringParameters && event.queryStringParameters.id;
        if (!eventId) {
          return buildResponse(400, { message: "Event id is required for deletion." });
        }
        return await removeEvent(eventId);
      case 'PUT':
        const updateData = JSON.parse(event.body);
        return await editEvent(updateData);
      default:
        return buildResponse(405, { message: "Method not allowed." });
    }
  } catch (error) {
    console.error("Error in router:", error);
    return buildResponse(500, { error: error.message });
  }
};
