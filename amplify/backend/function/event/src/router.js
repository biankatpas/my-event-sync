const { addEvent, editEvent, listEvents, removeEvent, verifyOwner, buildResponse } = require('./helpers');

exports.handleRequest = async (event) => {
  console.log("Request Context:", JSON.stringify(event.requestContext));
  
  try {
    const loggedUserId = event.requestContext?.authorizer?.claims?.sub;
    console.log("Logged user id:", loggedUserId);

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
        // await verifyOwner(eventId, loggedUserId);
        return await removeEvent(eventId);
      case 'PUT':
        const updateData = JSON.parse(event.body);
        // await verifyOwner(updateData.id, loggedUserId);
        return await editEvent(updateData);
      default:
        return buildResponse(405, { message: "Method not allowed." });
    }
  } catch (error) {
    console.error("Error in router:", error);
    return buildResponse(500, { error: error.message });
  }
};
