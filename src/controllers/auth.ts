import { Request, Response } from "express";
import { loginDTO } from "../types/auth";
import { Validator } from "../helpers/validator";

export class AuthController {
  public static async login(req: Request, res: Response) {
    const reqData: loginDTO = req.body;
    const validationResult = Validator.validateLoginReqData(reqData);

    if (!validationResult.status)
      return res.json({
        status: 400,
        message: validationResult.message
      });
    
    
  }
}
