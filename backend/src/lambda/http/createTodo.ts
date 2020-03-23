import 'source-map-support/register'
import{createTodo} from '../../businessLogic/todos'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
/*const docClient = new AWS.DynamoDB.DocumentClient()
const todoTable = process.env.GROUPS_TABLE*/

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  /*const timestamp = new Date().toString()
  const userid=getUserId(event)
  const duedate = new Date().toISOString()
  const itemId = uuid.v4()
  const newTodo: CreateTodoRequest = JSON.parse(event.body)
  const newItem = {
    userId:userid,
    date:timestamp,
    todoid: itemId,
    due: duedate,
    ...newTodo
  }

  await docClient.put({
    TableName: todoTable,
    Item: newItem
  }).promise()*/
/*const docClient = new AWS.DynamoDB.DocumentClient()
const todoTable = process.env.GROUPS_TABLE*/
  const newTodo: CreateTodoRequest = JSON.parse(event.body)
  const newItem= await createTodo(newTodo,event)
  return {
    statusCode: 200,
    headers: {
     'Access-Control-Allow-Origin': '*',
     'Access-Control-Allow-Credentials': true,
     'Access-Control-Allow-Methods': 'POST, GET,HEAD,OPTIONS,UPDATE,DELETE,PUT',
     'Access-Control-Allow-Headers':'*'
    },
    body: JSON.stringify({
     newItem
    })
  }
}
