# Lambda Function: Event

This Lambda function is responsible for handling CRUD operations for events in the My Event Sync project. It interacts with a DynamoDB table to store event data and supports the following HTTP methods:

- **GET**: Retrieves a list of events, sorted by date and time (first by date, then by time).
- **POST**: Creates a new event.
- **PUT**: Updates an existing event.
- **DELETE**: Deletes an event.

## Features

- **Create, List, Update, and Delete**: Full CRUD functionality for events.
- **Sorting**: Events are returned in order by date and then by time.
- **Error Handling**: Provides clear HTTP responses based on the outcome of each operation.
- **Integration**: Uses AWS DynamoDB for data persistence.

## Requirements

- **Node.js** (runs in AWS Lambda)
- AWS SDK for JavaScript (provided in the Lambda runtime)
- Environment variable:
  - `TABLE_NAME`: Name of the DynamoDB table that stores event data.

## File Structure

- **index.js**: The main entry point that exports the Lambda handler.
- **helpers.js**: Contains helper functions for performing CRUD operations:
  - `addEvent(data)`: Inserts a new event.
  - `listEvents()`: Retrieves and sorts events.
  - `editEvent(data)`: Updates an existing event.
  - `removeEvent(id)`: Deletes an event.
  - `buildResponse(statusCode, body)`: Helper for constructing HTTP responses.
- Other configuration files are managed by Amplify.

## Setup and Deployment

This function is managed via AWS Amplify. To deploy or update the function:

1. **Make your code changes** as necessary in the Lambda function folder.
2. **Deploy the changes** by running the following command from the root of your Amplify project:

```bash
   amplify push
```

This will update the backend resources, including the event Lambda function.
