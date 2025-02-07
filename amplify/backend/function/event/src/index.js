/* Amplify Params - DO NOT EDIT
	ENV
	REGION
	STORAGE_DYNAMO3EBF100B_ARN
	STORAGE_DYNAMO3EBF100B_NAME
	STORAGE_DYNAMO3EBF100B_STREAMARN
Amplify Params - DO NOT EDIT *//**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */

const router = require('./router');

exports.handler = async (event) => {
    return await router.handleRequest(event);
};
