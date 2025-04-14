export const allStatus = [
  "PENDING",
  "IN_PROGRESS",
  "COMPLETED",
  "DELETED",
] as const;

export type Status = (typeof allStatus)[number];

export type Task = {
  id?: string;
  title: string;
  description: string;
  status: Status;
  priority: number;
  dueDate: Date;
  createdAt?: Date;
  updatedAt?: Date;
  userId: string;
  sharedWith?: string[];
};

export type PaginationOptions={
  pageNumber: number;
  pageSize: number;
}

export type TaskFilterOptions = {
  status?: Status;
  priority?: number;
  dueDateStart?: Date;
  dueDateEnd?: Date;
};

export const AllTaskSortableFields = [
  "createdAt",
  "dueDate",
  "priority",
] as const;

export const AllSortDirections=["asc","desc"] as const;
export type SortDirection = (typeof AllSortDirections)[number];

export type TaskSortableFields = (typeof AllTaskSortableFields)[number];

export type TaskSortOptions = {
  orderBy: TaskSortableFields;
  order: SortDirection;
}
