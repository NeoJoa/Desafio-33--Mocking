import { UsersService, CartsService } from "../dao/repositories/index.js";
import { createHash } from "../utils.js";

export const post = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  if (!email || !password || !firstName || !lastName)
    return res.status(400).send({ status: 400, error: "Missing values" });
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
};

export const getAll = async (req, res) => {
  const getResponse = await UsersService.getAll();

  return !getResponse.error
    ? res.status(200).json(getResponse)
    : res.status(getResponse.status).send(getResponse);
};

export const getBy = async (req, res) => {
  const { email, id } = req.query;
  if (!email && !id)
    return res.status(400).send({ status: 400, error: "Incorrect filters" });
  const param = email ? { email: email } : { id: id };
  const getResponse = await UsersService.getBy(param);
  return !getResponse.error
    ? res.send(getResponse)
    : res.status(getResponse.status).send(getResponse);
};

export const putBy = async (req, res) => {
  if (!req.query.email && !req.query.id)
    return res.status(400).send({ status: 400, error: "Incorrect filters" });
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
};

export const deleteBy = async (req, res) => {
  if (!req.query.email && !req.query.id)
    return res.status(400).send({ status: 400, error: "Incorrect filters" });
  const param = req.query.email
    ? { email: req.query.email }
    : { id: req.query.id };
  const deleteResponse = await UsersService.deleteBy(param);

  return !deleteResponse.error
    ? res.send(deleteResponse)
    : res.status(deleteResponse.status).send(deleteResponse);
};
