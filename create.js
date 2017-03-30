import uuid from 'uuid'
import AWS from 'aws-sdk'

AWS.config.update({ region: 'us-west-2' })
const dynamoDb = new AWS.DynamoDB.DocumentClient()

export const main = (event, context, cb) => {
  const data = JSON.parse(event.body)

  const { content, attachment } = data

  const params = {
    TableName: 'notes',
    Item: {
      content,
      attachment,
      userId: event.requestContext.authorizer.claims.sub,
      noteId: uuid.v1(),
      createdAt: new Date().getTime(),
    }
  }

  dynamoDb.put(params, (error, data) => {
    // Enable CORS
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    }

    if (error) {
      const response = {
        statusCode: 500,
        headers: headers,
        body: JSON.stringify({status: false}),
      }
      callback(null, response)
      return
    }

    const response = {
      statusCode: 200,
      headers: headers,
      body: JSON.stringify(params.Item),
    }

    callback(null, response)
  })
}
