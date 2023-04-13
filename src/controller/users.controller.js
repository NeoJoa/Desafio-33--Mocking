import { UsersService } from "../dao/repositories/index.js";
import customError from "../errors/customError.js";
import { enumErrors } from "../errors/enumErrors.js";
import { createHash } from "../utils.js";

export const post = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    if (!email || !password || !firstName || !lastName)
      customError.create({
        name: "Error when trying post a user",
        message: "complete the inputs to register the user correctly",
        cause: "Incomplete required inputs",
        code: enumErrors.MISSING_VALUES,
        statusCode: 400,
      });
    const user = {
      firstName,
      lastName,
      email,
      password: createHash(password),
      cartId: undefined,
      role: "user",
    };

    const postResponse = await UsersService.post(user);

    return !postResponse.error
      ? res.status(201).send(postResponse)
      : res.status(postResponse.status).send(postResponse);
  } catch (error) {
    next(error);
  }
};

export const getAll = async (req, res) => {
  const getResponse = await UsersService.getAll();

  return !getResponse.error
    ? res.status(200).json(getResponse)
    : res.status(getResponse.status).send(getResponse);
};

export const getBy = async (req, res, next) => {
  try {
    const { email, id } = req.query;
    if (!email && !id)
      customError.create({
        name: "Error when trying to get a filtered user",
        message:
          "It is necessary to define the value of Email or Id to be able to filter a user correctly",
        cause: "Email or id undefined",
        code: enumErrors.INVALID_FILTER,
        statusCode: 400,
      });
    const param = email ? { email: email } : { id: id };
    const getResponse = await UsersService.getBy(param);
    console.log(getResponse);
    return !getResponse.error
      ? res.send(getResponse)
      : res.status(getResponse.status).send(getResponse);
  } catch (error) {
    next(error);
  }
};

export const putBy = async (req, res, next) => {
  try {
    if (!req.query.email && !req.query.id)
      customError.create({
        name: "Error when trying to get a filtered user",
        message:
          "It is necessary to define the value of Email or Id to be able to filter a user correctly",
        cause: "Email or id undefined",
        code: enumErrors.INVALID_FILTER,
        statusCode: 400,
      });
    const param = req.query.email
      ? { email: req.query.email }
      : { id: req.query.id };
    const { firstName, lastName, email, password, cartId, role } = req.body;
    if (!firstName && !lastName && !email && !password && !cartId && !role)
      return res.status(400).send({ status: 400, error: "Invalid update" });
    const object = { firstName, lastName, email, password, cartId, role };
    const putResponse = await UsersService.putBy(param, object);

    return !putResponse.error
      ? res.send(putResponse)
      : res.status(putResponse.status).send(putResponse);
  } catch (error) {
    next(error);
  }
};

export const deleteBy = async (req, res, next) => {
  try {
    if (!req.query.email && !req.query.id)
      customError.create({
        name: "Error when trying to get a filtered user",
        message:
          "It is necessary to define the value of Email or Id to be able to filter a user correctly",
        cause: "Email or id undefined",
        code: enumErrors.INVALID_FILTER,
        statusCode: 400,
      });
    const param = req.query.email
      ? { email: req.query.email }
      : { id: req.query.id };
    const deleteResponse = await UsersService.deleteBy(param);

    return !deleteResponse.error
      ? res.send(deleteResponse)
      : res.status(deleteResponse.status).send(deleteResponse);
  } catch (error) {
    next(error);
  }
};
