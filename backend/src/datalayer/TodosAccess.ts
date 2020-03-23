import * as AWS  from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
const XAWS = AWSXRay.captureAWS(AWS)
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'
import * as uuid from 'uuid'
const s3 = new AWS.S3({
    signatureVersion: 'v4'
  })
const imagesTable = process.env.IMAGES_TABLE
const bucketName = process.env.IMAGES_S3_BUCKET
const urlExpiration = process.env.SIGNED_URL_EXPIRATION

export class TodosAccess {

  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly groupsTable = process.env.GROUPS_TABLE) {
  }

  async getAllTodos(userId:string): Promise<TodoItem[]> {
    console.log('Getting all todos')

    const result = await this.docClient.query({
      TableName: this.groupsTable,
      KeyConditionExpression:'id= :id',
      ExpressionAttributeValues: {
        ':id': userId
    }
    }).promise()

    const items = result.Items
    return items as TodoItem[]
  }

  async createTodo(TodoItem: TodoItem): Promise<TodoItem> {
    await this.docClient.put({
      TableName: this.groupsTable,
      Item: TodoItem
    }).promise()

    return TodoItem
  }

  async updateTodo(TodoUpdate:TodoUpdate,todoId:string): Promise<string> {
      await this.docClient.update({
          TableName:this.groupsTable,
          Key:{
            ...TodoUpdate
        },
        ConditionExpression: 'todoId:todoId',
        ExpressionAttributeValues:{
          ':todoId': todoId
      },
      ReturnValues:"UPDATED_NEW"
      })
   return todoId
   }
   async deleteTodo(todosId:string):Promise<string>{
      await this.docClient.delete({
        TableName: this.groupsTable,
        Key:{
      'todosId':todosId
      },
        ConditionExpression:'todosId= :todosId',
        ExpressionAttributeValues: {
            ':todosId': todosId
      }
    }).promise()
return "deleted"
}

async generateUrl(todoId:string,event:any){
const imageId = uuid.v4()
const newItem = await createImage(todoId, imageId, event)
const url = getUploadUrl(imageId)

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      newItem: newItem,
      uploadUrl: url
    })
  }
    
}
async groupExists(groupId: string) {
    const result = await this.docClient
      .get({
        TableName: this.groupsTable,
        Key: {
          id: groupId
        }
      })
      .promise()
  
    console.log('Get Todos: ', result)
    return !!result.Item
  }
}
function createDynamoDBClient() {
  if (process.env.IS_OFFLINE) {
    console.log('Creating a local DynamoDB instance')
    return new XAWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:3000'
    })
  }

  return new XAWS.DynamoDB.DocumentClient()
}
async function createImage(groupId: string, imageId: string, event: any) {
    const timestamp = new Date().toISOString()
    const newImage = JSON.parse(event.body)
  
    const newItem = {
      groupId,
      timestamp,
      imageId,
      ...newImage,
      imageUrl: `https://${bucketName}.s3.amazonaws.com/${imageId}`
    }
    console.log('Storing new item: ', newItem)
  
    await this.docClient
      .put({
        TableName: imagesTable,
        Item: newItem
      })
      .promise()
  
    return newItem
  }
  function getUploadUrl(imageId: string) {
    return s3.getSignedUrl('putObject', {
      Bucket: bucketName,
      Key: imageId,
      Expires: urlExpiration
    })
    
  }
  
  
   