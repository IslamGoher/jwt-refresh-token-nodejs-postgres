import { RefreshTokenModel } from "../database/models/refreshToken";
import { v4 } from "uuid";
import { UserType } from "../database/types/types";
import { sign, verify, JwtPayload } from "jsonwebtoken";

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
    const jwtExpiresIn = Number(process.env.JWT_EXPRIRES_IN);
    const accessToken = sign(
      {
        user_id: userData.user_id,
        name: userData.name,
        email: userData.email,
      },
      jwtSecret,
      {
        algorithm: "HS256",
        expiresIn: jwtExpiresIn,
      }
    );
    return accessToken;
  }

  public static verifyAccessToken(accessToken: string, ignoreExpiration = false): {
    status: boolean;
    payload: any;
  } {
    try {
      const jwtSecret = process.env.JWT_SECRET!;
      const payload = verify(accessToken, jwtSecret, {
        algorithms: ["HS256"],
        ignoreExpiration
      });
      return {
        status: true,
        payload,
      };
    } catch (error) {
      console.log(error);
      return {
        status: false,
        payload: {},
      };
    }
  }

  public static async createUserTokens(userData: UserType): Promise<{
    refreshToken: string;
    accessToken: string;
  }> {
    const refreshToken = await this.createRefreshToken(userData.user_id!);
    const accessToken = this.createAccessToken(userData);

    return { refreshToken: refreshToken!, accessToken };
  }
}
