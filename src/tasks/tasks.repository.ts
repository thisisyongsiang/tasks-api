import { Model } from "mongoose";
import { TaskDocument, taskModel, toTask } from "./tasks.schema";
import {
  Task,
  TaskFilterOptions,
  PaginationOptions,
  TaskSortOptions,
} from "./types";

export class TasksRepository {
  constructor(private taskModel: Model<TaskDocument>) {}

  createTask(task: Task): Promise<Task> {
    return this.taskModel.insertOne(task).then(toTask);
  }

  upsertTask(task: Partial<Task>): Promise<Task> {
    return this.taskModel
      .findOneAndUpdate(
        { id: task.id, userId: task.userId },
        { $set: task },
        { upsert: false, new: false }
      )
      .then(toTask);
  }

  async filterAndSortTasks(
    userId: string,
    paginationOptions: PaginationOptions,
    filterOptions: TaskFilterOptions,
    sortOptions: TaskSortOptions = { orderBy: "dueDate", order: "asc" }
  ): Promise<{ tasks: Task[]; totalCount: number; hasMoreItems: boolean }> {
    const filterQuery = {
      ...(filterOptions.status && { status: filterOptions.status }),
      ...(filterOptions.priority !== null &&
        filterOptions.priority !== undefined && {
          priority: filterOptions.priority,
        }),
      ...(filterOptions.dueDateStart || filterOptions.dueDateEnd
        ? {
            dueDate: {
              ...(filterOptions.dueDateStart && {
                $gte: filterOptions.dueDateStart,
              }),
              ...(filterOptions.dueDateEnd && {
                $lte: filterOptions.dueDateEnd,
              }),
            },
          }
        : {}),
    };

    const data: {
      tasks: TaskDocument[];
      totalCount: { totalCount: number }[];
    }[] = await this.taskModel
      .aggregate([
        {
          $match: {
            status: { $ne: "DELETED" },
          },
        },
        {
          $match: {
            $and: [{ userId, ...filterQuery }],
          },
        },
        {
          $facet: {
            tasks: [
              {
                $sort: {
                  [sortOptions.orderBy]: sortOptions.order === "asc" ? 1 : -1,
                },
              },
              {
                $skip:
                  (paginationOptions.pageNumber - 1) *
                  paginationOptions.pageSize,
              },
              { $limit: paginationOptions.pageSize },
            ],
            totalCount: [
              {
                $count: "totalCount",
              },
            ],
          },
        },
      ])
      .exec();
    const totalCount = data[0]?.totalCount[0]?.totalCount || 0;
    return {
      tasks: data[0].tasks.map(toTask),
      totalCount: totalCount,
      hasMoreItems:
        totalCount > paginationOptions.pageNumber * paginationOptions.pageSize,
    };
  }
}

export const tasksRepository = new TasksRepository(taskModel);
