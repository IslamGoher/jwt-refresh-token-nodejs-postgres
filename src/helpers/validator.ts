import Joi from "joi";

export class Validator {
  public static validateLoginReqData(reqData: object) {
    const joiSchema = Joi.object({
      name: Joi.string(),
      email: Joi.string().email(),
      password: Joi.string().min(8),
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
