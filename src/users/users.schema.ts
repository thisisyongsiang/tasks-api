import { Schema } from "mongoose";
import { v4 } from "uuid";
import { User } from "./types";
import { mongooseConnection } from "../mongo";

const UserSchema: Schema = new Schema(
  {
    id: { type: String, default: v4, required: true,unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
    updatedAt: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

UserSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

export interface UserDocument extends User, Document {}

export const userModel = mongooseConnection.model<UserDocument>(
  "user",
  UserSchema
);

export const toUser = (document: UserDocument): User => {
  return (
    document && {
      id: document.id,
      name: document.name,
      password: document.password,
      email: document.email,
      role: document.role,
    }
  );
};
