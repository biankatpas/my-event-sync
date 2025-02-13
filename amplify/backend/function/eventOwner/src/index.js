/* Amplify Params - DO NOT EDIT
	ENV
	REGION
	STORAGE_DYNAMOA3FD081D_ARN
	STORAGE_DYNAMOA3FD081D_NAME
	STORAGE_DYNAMOA3FD081D_STREAMARN
Amplify Params - DO NOT EDIT *//* Amplify Params - DO NOT EDIT
  ENV
	REGION
	STORAGE_DYNAMOA3FD081D_ARN
	STORAGE_DYNAMOA3FD081D_NAME
	STORAGE_DYNAMOA3FD081D_STREAMARN
Amplify Params - DO NOT EDIT *//**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */

const { listItems, buildResponse } = require('./helpers');

exports.handler = async (event, context) => {  
  try {
    const items = await listItems();
    return buildResponse(200, items);
  } catch (error) {
    return buildResponse(500, { error: error.message });
  }
};
