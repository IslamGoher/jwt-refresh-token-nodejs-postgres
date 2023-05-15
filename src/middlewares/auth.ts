import { NextFunction, Request, Response } from "express";
import { sign, verify } from "jsonwebtoken";

export class AuthMiddleware {
  public static async isAccessTokenVerified(
    req: Request | any,
    res: Response,
    next: NextFunction
  ) {
    try {
      const token = req.headers["x-access-token"];

      if (!token) {
        return res.json({
          status: 401,
          message: "Unauthenticated"
        });
      }
      const result = verify(String(token), String(process.env.JWT_SECRET));

      req.user = result;
      next();
    } catch (error) {
      res.json({
        status: 403,
        message: "Unauthorized"
      });
    }
  }
}
