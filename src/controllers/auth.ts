import { Request, Response } from "express";
import { loginDTO, registerDTO } from "../types/auth";
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

      const { refreshToken, accessToken } = await AuthService.createUserTokens(
        currentUser
      );

      res.cookie("rtoken", refreshToken, {
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

  public static async register(req: Request, res: Response) {
    const reqData: registerDTO = req.body;
    const validationResult = Validator.validateRegisterReqData(reqData);

    if (!validationResult.status)
      return res.json({
        status: 400,
        message: validationResult.message,
      });

    const currentUser = await UserModel.getUserByEmail(reqData.email);

    if (currentUser)
      return res.json({
        status: 409,
        message: "this email already exists",
      });

    const newUser = await UserModel.create(reqData);

    const { refreshToken, accessToken } = await AuthService.createUserTokens(
      newUser
    );

    res.cookie("rtoken", refreshToken, {
      httpOnly: true,
      sameSite: "strict",
    });

    return res.json({
      status: 200,
      message: "user successfully registered",
      token: accessToken,
    });
  }
}
