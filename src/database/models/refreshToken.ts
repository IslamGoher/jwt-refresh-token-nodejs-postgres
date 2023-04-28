import { Database } from "../config/dbConfig";

export class RefreshTokenModel {
  public static async createTable() {
    await Database.query(`
      CREATE TABLE IF NOT EXISTS RefreshToken(
        userID INT REFERENCES Users(userID) ON DELETE CASCADE,
        token VARCHAR NOT NULL,
        expireDate TIMESTAMP NOT NULL
      );
    `);
  }
}