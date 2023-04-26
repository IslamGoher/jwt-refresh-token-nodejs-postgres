import { Pool, Client, ConnectionConfig } from "pg";

export class Database {
  private static pool = new Pool({
    connectionString: process.env.DB_POOL_URL,
  });

  private static client = new Client({
    connectionString: process.env.DB_CLIENT_URL,
  });

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
      
    } catch (error) {
      console.error(error)
    }
  }

  public static async init() {
    // connect to client
    // create database
    // disconnect the client
    // connect to pool
    // create tables
    // return pool
  }
}
