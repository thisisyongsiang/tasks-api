import mongoose from "mongoose";
import { logger } from "./utils/logger";
import { config } from "dotenv";
config();

class MongooseConnect {
  private static instance: MongooseConnect;
  connection: mongoose.Connection;
  private constructor(private dbUri: string = process.env.MONGO_DB_URI) {
    this.connect();
  }

  // Use singleton pattern to ensure only one instance of MongooseConnect
  public static getInstance(): MongooseConnect {
    if (!MongooseConnect.instance) {
      MongooseConnect.instance = new MongooseConnect();
    }
    return MongooseConnect.instance;
  }

  public connect() {
    this.connection = mongoose.createConnection(this.dbUri);
    logger.info("Connected to MongoDB");
  }
}

export const mongooseConnection = MongooseConnect.getInstance().connection;
