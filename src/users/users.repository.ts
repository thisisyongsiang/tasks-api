import { Model } from "mongoose";
import { toUser, UserDocument, userModel } from "./users.schema";
import { User } from "./types";

export class UsersRepository {
  constructor(private userModel: Model<UserDocument>) {}

  upsertUser(user: User): Promise<User> {
    return this.userModel
      .findOneAndUpdate(
        { email: user.email },
        { $set: user },
        { upsert: true, new: true }
      )
      .then(toUser);
  }

  findUserByEmail(email: string): Promise<User> {
    return this.userModel.findOne({ email }).then(toUser);
  }
}

export const usersRepository = new UsersRepository(userModel);
