import * as Joi from "joi";
import {
  AllSortDirections,
  allStatus,
  AllTaskSortableFields,
} from "../tasks/types";

export const createTaskSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  dueDate: Joi.date().required(),
  status: Joi.string()
    .valid(...allStatus.filter((status) => status !== "DELETED"))
    .default(allStatus[0]),
  priority: Joi.number().integer().min(0).max(5).default(5),
});

export const updateTaskSchema = Joi.object({
  id: Joi.string().required(),
  title: Joi.string(),
  description: Joi.string(),
  dueDate: Joi.date(),
  status: Joi.string().valid(
    ...allStatus.filter((status) => status !== "DELETED")
  ),
  priority: Joi.number().integer().min(0).max(5),
});

export const fetchTasksSchema = Joi.object({
  pageNumber: Joi.number().integer().min(1).default(1),
  pageSize: Joi.number().integer().min(1).default(10),
  status: Joi.string().valid(...allStatus),
  priority: Joi.number().integer().min(0).max(5),
  dueDateStart: Joi.date(),
  dueDateEnd: Joi.date(),
  orderBy: Joi.string()
    .valid(...AllTaskSortableFields)
    .default(AllTaskSortableFields[0]),
  order: Joi.string()
    .valid(...AllSortDirections)
    .default(AllSortDirections[0]),
});
