# Lambda Function: Delete Old Events

This Lambda function is responsible for deleting old events from the DynamoDB table in the My Event Sync project. It is part of the backend managed by AWS Amplify and is invoked via an API Gateway endpoint when a DELETE request is received.

## Features

- **Event Deletion:** Removes a specified event from the DynamoDB table.
- **HTTP DELETE Method:** Expects an event ID to be passed as a query parameter.
- **Error Handling:** Returns appropriate HTTP status codes and error messages for missing parameters or deletion failures.

## Requirements

- **Node.js** (runtime provided by AWS Lambda)
- AWS SDK for JavaScript (preinstalled in the Lambda runtime)
- Environment variable:
  - `TABLE_NAME`: The name of the DynamoDB table containing event data.

## File Structure

- **index.js**: The main entry point that exports the Lambda handler.
- **helpers.js**: Contains helper functions, including:
  - `removeEvent(id)`: Deletes an event based on the provided ID.
  - `buildResponse(statusCode, body)`: Constructs HTTP responses.
- Additional configuration files are managed by Amplify.

## Setup and Deployment

This function is managed using AWS Amplify. To update or deploy changes:

1. **Make your code changes** in the Lambda function folder.
2. **Deploy the changes** by running the following command from the root of your Amplify project:

```bash
   amplify push
```

This will update the backend resources, including the Delete Event Lambda function.
