import { comparePasswords, hashPassword } from "../utils/auth";
import {
  AuthFailureError,
  ConflictError,
  InternalError,
} from "../common/errors";
import { Role, User } from "./types";
import { usersRepository, UsersRepository } from "./users.repository";
import { generateToken } from "../utils/jwt";

export class UsersService {
  constructor(private userRepository: UsersRepository) {}

  /**
   * This function creates a new user in the database.
   * It first checks if the user already exists by email.
   * If the user does not exist, it hashes the password and creates a new user.
   * If the user already exists, it throws a ConflictError.
   *
   * @param email Email of user to be created. Must be unique
   * @param password Password of user to be created.
   * @param name Name of user to be created. If not provided, email will be used as name.
   * @param role Role of user to be created. Default is USER.
   * @returns JWT Token for the created user.
   */
  async createUser(
    email: string,
    password: string,
    name?: string,
    role: Role = "USER"
  ): Promise<string> {
    const existingUser = await this.userRepository.findUserByEmail(email);
    if (existingUser) {
      throw new ConflictError("User already exists");
    } else {
      try {
        const hashedPassword = await hashPassword(password);
        const user: User = {
          email,
          name: name || email,
          password: hashedPassword,
          role: role,
        };
        const createdUser = await this.userRepository.upsertUser(user);
        delete createdUser.password;
        return generateToken(createdUser);
      } catch (error) {
        throw new InternalError("Sign up Failed: " + error.message);
      }
    }
  }

  async userLogin(
    email: string,
    password: string
  ): Promise<{ token: string; user: Omit<User, "password"> }> {
    const user = await this.userRepository.findUserByEmail(email);
    if (!user) {
      throw new AuthFailureError("Invalid Credentials");
    }
    const passwordMatch = await comparePasswords(password, user.password);
    if (!passwordMatch) {
      throw new AuthFailureError("Invalid Credentials");
    }
    delete user.password;
    return { token: generateToken(user), user };
  }
}

export const usersService = new UsersService(usersRepository);
