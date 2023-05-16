import Joi from "joi";

export class Validator {
  public static validateLoginReqData(reqData: object) {
    const joiSchema = Joi.object({
      name: Joi.string().required(),
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
}
