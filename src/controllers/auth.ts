import { Request, Response } from "express";
import { loginDTO, registerDTO } from "../types/auth";
import { Validator } from "../helpers/validator";
import { UserModel } from "../database/models/user";
import { compare, hash } from "bcrypt";
import { AuthService } from "../services/auth";
import { Utils } from "../helpers/utils";
import { RefreshTokenModel } from "../database/models/refreshToken";
import { UserType } from "../database/types/types";

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

    const hashedPassword = await hash(reqData.password, 10);
    const userData: UserType = {
      email: reqData.email,
      name: reqData.name,
      password: hashedPassword,
    };
    const newUser = await UserModel.create(userData);
    console.log({newUser});

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

  public static async refreshAccessToken(req: Request, res: Response) {
    try {
      const reqCookies = req.headers.cookie;
      const accessToken = String(req.headers["x-access-token"]);

      const invalidTokenResponse = {
        status: 403,
        message: "invalid token",
      };

      if (!reqCookies?.trim().replace(/ /g, ""))
        return res.json(invalidTokenResponse);

      if (!accessToken) return res.json(invalidTokenResponse);

      const reqRefreshToken = Utils.parseCookie(reqCookies).rtoken;

      if (!reqRefreshToken) return res.json(invalidTokenResponse);

      const accessTokenVerificationResult =
        AuthService.verifyAccessToken(accessToken, true);

      if (!accessTokenVerificationResult.status)
        return res.json(invalidTokenResponse);

      const accessTokenPayload: UserType =
        accessTokenVerificationResult.payload;

      const refreshTokenVerificationResult =
        await AuthService.verifyRefreshToken(
          accessTokenPayload.user_id!,
          reqRefreshToken
        );

      if (!refreshTokenVerificationResult)
        return res.json(invalidTokenResponse);

      const currentUser = await UserModel.getUserByID(
        accessTokenPayload.user_id!
      );

      delete currentUser.password;

      const newAccessToken = AuthService.createAccessToken(currentUser);

      return res.json({
        status: 200,
        message: "success",
        token: newAccessToken,
      });
    } catch (error) {
      console.error(error);
      return res.json({
        status: 500,
        message: "server error",
      });
    }
  }
}
