import { Schema } from "mongoose";
import { v4 } from "uuid";
import { mongooseConnection } from "../mongo";
import { Task } from "./types";

const TaskSchema: Schema = new Schema(
  {
    id: { type: String, default: v4, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: ["PENDING", "IN_PROGRESS", "COMPLETED", "DELETED"],
      default: "PENDING",
    },
    priority: {
      type: Number,
      validate: {
        validator: Number.isInteger,
        message: "priority must be an integer",
      },
      min: 0,
      default: 5,
    },
    dueDate: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    userId: { type: String, required: true },
    sharedWith: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

TaskSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

TaskSchema.index({ userId: 1 });
TaskSchema.index({ status: 1 });
TaskSchema.index({ dueDate: 1 });
TaskSchema.index({ priority: 1 });

TaskSchema.index({ userId: 1, status: 1 });
TaskSchema.index({ userId: 1, dueDate: 1 });
TaskSchema.index({ userId: 1, status: 1, dueDate: 1 });
TaskSchema.index({ userId: 1, priority: 1 });

export interface TaskDocument extends Task, Document {}

export const taskModel = mongooseConnection.model<TaskDocument>(
  "task",
  TaskSchema
);

export const toTask = (document: TaskDocument): Task => {
  return (
    document && {
      id: document.id,
      title: document.title,
      description: document.description,
      status: document.status,
      priority: document.priority,
      dueDate: document.dueDate,
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
      userId: document.userId,
      sharedWith: document.sharedWith,
    }
  );
};
