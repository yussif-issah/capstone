import 'source-map-support/register'
//import * as AWS from 'aws-sdk'
//import{getUserId} from '../utils'
import{getAllTodos} from '../../businessLogic/todos'


//const docClient=new AWS.DynamoDB.DocumentClient()
//const Table=process.env.GROUPS_TABLE
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // TODO: Get all TODO items for a current user
  /*const userid=getUserId(event)
  console.log("processing event",event)
  const results=await docClient.query({
      TableName:Table,
    KeyConditionExpression:"userId= :val",
    ExpressionAttributeValues: {
        ":val": userid
    }
  }).promise()
  const items=results.Items*/
const items=await getAllTodos(event)
  return{
      statusCode:200,
      headers:{
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Methods': 'PUT,UPDATE,OPTIONS,HEAD,DELETE,POST',
        'Access-Control-Allow-Headers':'*'
      },
      body:JSON.stringify({
          items
      })
  
  }
  
}
