import joi from "joi";

const validRegisterSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().min(5).max(15).required(),
  name: joi.string().required(),
});

export default validRegisterSchema;