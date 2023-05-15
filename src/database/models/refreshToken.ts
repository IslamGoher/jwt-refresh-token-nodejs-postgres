import { Database } from "../config/dbConfig";
import { RefreshTokenType } from "../types/types";

export class RefreshTokenModel {
  public static async createTable() {
    await Database.query(`
      CREATE TABLE IF NOT EXISTS refresh_tokens(
        user_id INT REFERENCES Users(user_id) ON DELETE CASCADE,
        token VARCHAR NOT NULL,
        expire_date TIMESTAMP NOT NULL
      );
    `);
  }

  public static async create(
    refreshTokenData: RefreshTokenType
  ): Promise<RefreshTokenType> {
    return (
      await Database.query<RefreshTokenType>(
        `
        INSERT INTO
          refresh_tokens(user_id, token, expire_date)
          VALUES($1, $2, $3)
        RETURNING *;
      `,
        [
          refreshTokenData.user_id,
          refreshTokenData.token,
          refreshTokenData.expire_date,
        ]
      )
    )[0];
  }

  public static async getOneByUserID(
    userID: number
  ): Promise<RefreshTokenType | null> {
    const refreshToken = await Database.query<RefreshTokenType>(
      "SELECT * FROM refresh_tokens WHERE user_id = $1",
      [userID]
    );
    return refreshToken[0];
  }
}
