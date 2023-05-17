import Joi from "joi";
import { loginDTO, registerDTO } from "../types/auth";

export class Validator {
  public static validateLoginReqData(reqData: loginDTO) {
    const joiSchema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(8).required(),
    });
    const validationResult = joiSchema.validate(reqData);

    if (validationResult.error)
      return {
        status: false,
        message: validationResult.error.message.replace(/"/g, "'"),
      };

    return { status: true, message: "" };
  }

  public static validateRegisterReqData(reqData: registerDTO) {
    const joiSchema = Joi.object({
      name: Joi.string().min(3).required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(8).required(),
    });

    const validationResult = joiSchema.validate(reqData);

    if (validationResult.error)
      return {
        status: false,
        message: validationResult.error.message.replace(/"/g, "'")
      }

    return { status: true, message: "" };
  }
}
