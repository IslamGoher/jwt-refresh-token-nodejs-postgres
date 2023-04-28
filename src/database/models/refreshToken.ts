import { Database } from "../config/dbConfig";
import { RefreshTokenType } from "../types/types";

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

  public static async create(refreshTokenData: RefreshTokenType): Promise<RefreshTokenType> {
    return await Database.query<RefreshTokenType>(
      `
        INSERT INTO
          Users(userID, token, expireDate)
          VALUES($1, $2, $3)
        RETURNING *;
      `,
      [
        refreshTokenData.userID,
        refreshTokenData.token,
        refreshTokenData.expireDate
      ]
    );
  }
}