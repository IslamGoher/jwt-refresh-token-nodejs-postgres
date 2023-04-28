import { Pool, Client, ConnectionConfig } from "pg";
import { UserModel } from "../models/user";
import { RefreshTokenModel } from "../models/refreshToken";

export class Database {
  private static pool = new Pool({
    connectionString: process.env.DB_POOL_URL,
  });

  private static client = new Client({
    connectionString: process.env.DB_CLIENT_URL,
  });

  public static async query(queryText: string, values?: any[] | undefined) {
    return await this.pool.query(queryText, values);
  }

  private static async createDatabase() {
    try {
      await this.client.connect();

      const dbName = process.env.DB_NAME;
      const response = await this.client.query(
        `SELECT 1 FROM pg_database WHERE datname=${dbName};`
      );

      if (response.rowCount !== 1) {
        await this.client.query(`CREATE DATABASE ${dbName}`);
        console.log("database created");
      } else console.log("database already exists");

      await this.client.end();
    } catch (error) {
      console.error(error);
    }
  }

  private static async createTables() {
    try {
      await this.pool.connect();

      await UserModel.createTable();
      await RefreshTokenModel.createTable();

      console.log("database tables created");
    } catch (error) {
      console.error(error);
    }
  }

  public static async init() {
    await this.createDatabase();
    await this.createTables();
  }
}
