import { tasksRepository, TasksRepository } from "./tasks.repository";
import {
  Task,
  PaginationOptions,
  TaskFilterOptions,
  TaskSortOptions,
} from "./types";

export class TasksService {
  constructor(private tasksRepository: TasksRepository) {}

  updateTask(task: Task): Promise<Task> {
    return this.tasksRepository.upsertTask(task);
  }

  createTask(task: Task): Promise<Task> {
    return this.tasksRepository.createTask(task);
  }

  /**
   * This function fetches tasks for a user with pagination,
   * sorting and filtering options.
   *
   * @param userId - The ID of the user whose tasks are to be fetched.
   * @param paginationOptions - Pagination options to limit the number of tasks returned.
   * @param filterOptions - Filter options to filter tasks based on status, priority, and due date range.
   * @param sortOptions - Sorting options to sort tasks based on due date or priority.
   * @returns
   */
  fetchPaginatedSortedFilteredTasks(
    userId: string,
    paginationOptions: PaginationOptions,
    filterOptions: TaskFilterOptions,
    sortOptions?: TaskSortOptions
  ): Promise<{ tasks: Task[]; totalCount: number; hasMoreItems: boolean }> {
    return this.tasksRepository.filterAndSortTasks(
      userId,
      paginationOptions,
      filterOptions,
      sortOptions
    );
  }

  /**
   * This function deletes a single task by ID by changing the tasks status as DELETED.
   *
   * @param id
   * @returns
   */
  deleteTask(id: string, userId): Promise<Task> {
    return this.tasksRepository.upsertTask({
      id: id,
      userId,
      status: "DELETED",
    });
  }
}

export const tasksService = new TasksService(tasksRepository);
