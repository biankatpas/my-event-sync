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

const { listItems } = require('./helpers');

exports.handler = async (event, context) => {  
  try {
    const items = await listItems();
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(items),
    };
  } catch (error) {
    console.error('Erro ao listar itens:', error);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Erro interno no servidor" }),
    };
  }
};
