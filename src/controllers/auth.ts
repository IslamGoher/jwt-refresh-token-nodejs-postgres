import { Request, Response } from "express";
import { loginDTO } from "../types/auth";
import { Validator } from "../helpers/validator";
import { UserModel } from "../database/models/user";
import { compare } from "bcrypt";
import { AuthService } from "../services/auth";

export class AuthController {
  public static async login(req: Request, res: Response) {
    try {
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
          message: "invalid password",
        });

      const refreshToken = await AuthService.createRefreshToken(
        currentUser.user_id!
      );
      const accessToken = AuthService.createAccessToken(currentUser);

      res.cookie("rToken", refreshToken, {
        httpOnly: true,
        sameSite: "strict",
      });

      return res.json({
        status: 200,
        message: "user successfully login",
        token: accessToken,
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
