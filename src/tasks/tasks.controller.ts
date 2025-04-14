import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger";
import { ResponseStatus } from "../common/common.types";
import { tasksService } from "./tasks.service";
import { handleErrorIn } from "../common/errors";
import { Task } from "./types";

export const createTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    logger.info("Creating Task");
    const { title, description, dueDate, status, priority } = req.body;
    const userId = req.auth.id;
    const task: Task = {
      title,
      description,
      dueDate,
      status,
      priority,
      userId,
    };
    const createdTask = await tasksService.createTask(task);
    res.status(ResponseStatus.CREATED).json({ createdTask });
  } catch (error) {
    handleErrorIn("Creating Task", next)(error);
  }
};

export const fetchTasks = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    logger.info("Fetching Tasks");
    const {
      pageNumber,
      pageSize,
      status,
      priority,
      dueDateStart,
      dueDateEnd,
      orderBy,
      order,
    } = req.body;
    const userId = req.auth.id;
    const result = await tasksService.fetchPaginatedSortedFilteredTasks(
      userId,
      {
        pageNumber,
        pageSize,
      },
      {
        status,
        priority,
        dueDateStart,
        dueDateEnd,
      },
      {
        orderBy,
        order,
      }
    );
    res.status(ResponseStatus.SUCCESS).json(result);
  } catch (error) {
    handleErrorIn("Fetching Tasks", next)(error);
  }
};

export const updateTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id, title, description, dueDate, status, priority } = req.body;
    const userId = req.auth.id;
    const task: Task = {
      id,
      title,
      description,
      dueDate,
      status,
      priority,
      userId,
    };
    const updatedTask = await tasksService.updateTask(task);
    logger.info("Updating Task");
    res.status(ResponseStatus.SUCCESS).json({ updatedTask });
  } catch (error) {
    handleErrorIn("Updating Task", next)(error);
  }
};
export const deleteTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    logger.info("Deleting Task");
    const taskId = req.params.id;
    const userId = req.auth.id;
    await tasksService.deleteTask(taskId, userId);
    res.status(ResponseStatus.SUCCESS_NO_CONTENT).send();
  } catch (error) {
    handleErrorIn("Deleting Task", next)(error);
  }
};
