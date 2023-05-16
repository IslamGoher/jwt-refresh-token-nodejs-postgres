import { Request, Response } from "express";
import { loginDTO } from "../types/auth";
import { Validator } from "../helpers/validator";
import { UserModel } from "../database/models/user";
import { compare } from "bcrypt";

export class AuthController {
  public static async login(req: Request, res: Response) {
    const reqData: loginDTO = req.body;
    const validationResult = Validator.validateLoginReqData(reqData);

    if (!validationResult.status)
      return res.json({
        status: 400,
        message: validationResult.message,
      });

    const currentUser = await UserModel.getUserByEmail(reqData.email);

    if (!currentUser)
      return res.json({
        status: 404,
        message: "there's no user found with given email",
      });

    const isPasswordValid = await compare(
      reqData.password,
      currentUser.password!
    );

    if (!isPasswordValid)
      return res.json({
        status: 403,
        message: "invalid password"
      });

    
  }
}
