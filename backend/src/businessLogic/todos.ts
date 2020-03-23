import * as uuid from 'uuid'

import { TodoItem} from '../models/TodoItem'
import { TodosAccess } from '../dataLayer/TodosAccess'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { getUserId } from '../lambda/utils'
import { APIGatewayProxyEvent } from 'aws-lambda'

const todosAccess = new TodosAccess()

export async function getAllTodos(event:APIGatewayProxyEvent): Promise<TodoItem[]> {
    const userId=await getUserId(event)
   return await todosAccess.getAllTodos(userId)
}
export async function generateURL(todoId:string,event:APIGatewayProxyEvent):Promise<any>{
    return await todosAccess.generateUrl(todoId,event)
}
export async function updateTodo(
    UpdateTodoRequest:UpdateTodoRequest,
    todoId:string
    ): Promise<string>{
        return await todosAccess.updateTodo({
            name:UpdateTodoRequest.name,
            dueDate:UpdateTodoRequest.dueDate,
            done:UpdateTodoRequest.done
        },todoId)
    }

export async function deleteTodo(ID:string){
    return await todosAccess.deleteTodo(ID)
}

export async function createTodo(
  CreateTodoRequest: CreateTodoRequest,
  jwtToken: APIGatewayProxyEvent
): Promise<TodoItem> {

  const itemId = uuid.v4()
  const userId = getUserId(jwtToken)
  const time=new Date().toString()
  return await todosAccess.createTodo({
    todoId: itemId,
    userId: userId,
    name: CreateTodoRequest.name,
    dueDate: CreateTodoRequest.dueDate,
    createdAt: time,
    done:true
  })
}

export async function groupExist(todoId:string):Promise<boolean>{
    const result=await todosAccess.groupExists(todoId)
    return result
}
