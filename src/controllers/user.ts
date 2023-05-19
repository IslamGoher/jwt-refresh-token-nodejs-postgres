import { Request, Response } from "express";
import { UserType } from "../database/types/types";
import { UserModel } from "../database/models/user";

export class UserController {
  public static async getUserProfile(req: Request | any, res: Response) {
    try {
      const userData: UserType = req.user;

      const currentUser = await UserModel.getUserByID(userData.user_id!);
      delete currentUser.password;

      return res.json({
        status: 200,
        message: "success",
        user: currentUser,
      });
    } catch (error) {
      console.log(error);
      return res.json({
        status: 500,
        message: "server error",
      });
    }
  }
}
