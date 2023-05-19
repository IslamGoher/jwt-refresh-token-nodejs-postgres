import { NextFunction, Request, Response } from "express";
import { AuthService } from "../services/auth";

export class AuthMiddleware {
  public static async isUserVerified(
    req: Request | any,
    res: Response,
    next: NextFunction
  ) {
    const unauthorizedResponse = {
      status: 403,
      message: "Unauthorized",
    };
    const unauthenticatedResponse = {
      status: 401,
      message: "Unauthenticated",
    };

    try {
      const accessToken: string = String(req.headers["x-access-token"]);

      if (!accessToken) {
        return res.json(unauthenticatedResponse);
      }

      const accessTokenVerificationResult =
        AuthService.verifyAccessToken(accessToken);

      if (!accessTokenVerificationResult.status)
        return res.json(unauthorizedResponse);

      req.user = accessTokenVerificationResult.payload;
      next();
    } catch (error) {
      return res.json(unauthorizedResponse);
    }
  }
}
