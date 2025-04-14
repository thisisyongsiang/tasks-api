import { adminGuard } from "../guard/authGuard";
import { ApiRoute, ApiRouter } from "../router";
import {
  createTask,
  deleteTask,
  fetchTasks,
  updateTask,
} from "../tasks/tasks.controller";
import { createTaskSchema, fetchTasksSchema, updateTaskSchema } from "../validator/task.schema.validators";
import { requestBodyValidator } from "../validator/validator";

class TasksRouter extends ApiRouter {
  routes: ApiRoute[] = [
    {
      method: "post",
      path: "/",
      handlers: [requestBodyValidator(fetchTasksSchema),fetchTasks],
    },
    {
      method: "post",
      path: "/create",
      handlers: [requestBodyValidator(createTaskSchema), createTask],
    },
    {
      method: "put",
      path: "/update",
      handlers: [requestBodyValidator(updateTaskSchema),updateTask],
    },
    {
      method: "delete",
      path: "/:id",
      handlers: [adminGuard, deleteTask],
    },
  ];
}

export const tasks = new TasksRouter().configure();
