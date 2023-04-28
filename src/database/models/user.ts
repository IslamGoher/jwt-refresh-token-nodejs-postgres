import { Database } from "../config/dbConfig";

export class UserModel {
  public static async createTable() {
    await Database.query(`
      CREATE TABLE IF NOT EXISTS Users(
        userID INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        name VARCHAR (255) NOT NULL,
        email VARCHAR (255) NOT NULL,
        password VARCHAR NOT NULL
      );
    `);
  }
}