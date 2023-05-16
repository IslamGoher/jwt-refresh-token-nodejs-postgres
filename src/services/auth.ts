import { RefreshTokenModel } from "../database/models/refreshToken";
import { v4 } from "uuid";
import { UserType } from "../database/types/types";
import { sign } from "jsonwebtoken";

export class AuthService {
  public static async createRefreshToken(
    userID: number
  ): Promise<string | null> {
    try {
      await RefreshTokenModel.deleteUserRefreshTokens(userID);

      const uuid = v4();
      const refreshTokenPeriod = Number(process.env.REFRESH_TOKEN_PERIOD);
      const expiredAt = Date.now() + refreshTokenPeriod;
      const expireDate = new Date(expiredAt);
      const refreshToken = await RefreshTokenModel.create({
        expire_date: expireDate,
        token: uuid,
        user_id: userID,
      });

      return refreshToken.token!;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  public static async verifyRefreshToken(
    userID: number,
    refreshToken: string
  ): Promise<boolean> {
    const currentRefreshToken = await RefreshTokenModel.getOneByUserIDAndToken(
      userID,
      refreshToken
    );

    if (!currentRefreshToken) return false;
    const isTokenVerified = currentRefreshToken.expire_date! > new Date();
    return isTokenVerified;
  }

  public static createAccessToken(userData: UserType): string {
    const jwtSecret = process.env.JWT_SECRET!;
    const accessToken = sign(userData, jwtSecret, {algorithm: "HS256"});
    return accessToken;
  }
}
