import joi from "joi";

const validatLoginSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().min(5).max(15).required(),
});


export default validatLoginSchema;