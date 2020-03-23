import 'source-map-support/register'
//import * as AWS  from 'aws-sdk'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import{updateTodo} from '../../businessLogic/todos'
//const docClient=new AWS.DynamoDB.DocumentClient()
//const Table=process.env.GROUPS_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)
  /*await docClient.update({
    TableName: Table,
    Key:{
      ...updatedTodo
  },
  ConditionExpression: "id:num",
  ExpressionAttributeValues:{
    ":num": todoId
},
ReturnValues:"UPDATED_NEW"
  })*/
  const update=await updateTodo(updatedTodo,todoId)
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
      'Access-Control-Allow-Methods': 'POST, GET,HEAD,OPTIONS,UPDATE,DELETE,PUT',
      'Access-Control-Allow-Headers':'*'
    },
    body: JSON.stringify({
      update
    })
  }
}
