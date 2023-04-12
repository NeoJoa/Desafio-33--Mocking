import { ProductsService } from "../dao/repositories/index.js";

export const post = async (req, res) => {
  const {
    title,
    description,
    code,
    price,
    status = true,
    stock,
    category,
    thumbnails,
  } = req.body;

  if (
    !title ||
    !description ||
    !code ||
    !price ||
    !status ||
    !stock ||
    !category ||
    !thumbnails
  )
    return res.status(400).send({ status: 400, error: "Missing values" });

  const product = {
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnails,
  };

  const postResponse = await ProductsService.post(product);

  return !postResponse.error
    ? res.status(201).send(postResponse)
    : res.status(postResponse.status).send(postResponse);
};

export const getAll = async (req, res) => {
  let { query, limit, page, sort } = req.query;
  if (limit) limit = +limit;
  if (page) page = +page;
  if (sort) sort = +sort;
  const getResponse = await ProductsService.getAll(query, limit, page, sort);

  return !getResponse.error
    ? res.status(200).json(getResponse)
    : res.status(getResponse.status).send(getResponse);
};

export const getById = async (req, res) => {
  const id = req.params.pid;
  const getResponse = await ProductsService.getById(id);
  return !getResponse.error
    ? res.send(getResponse)
    : res.status(getResponse.status).send(getResponse);
};

export const putById = async (req, res) => {
  const id = req.params.pid;
  const {
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnails,
  } = req.body;
  const object = {
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnails,
  };
  const putResponse = await ProductsService.putById(id, object);

  return !putResponse.error
    ? res.send(putResponse)
    : res.status(putResponse.status).send(putResponse);
};

export const deleteById = async (req, res) => {
  const id = req.params.pid;
  const deleteResponse = await ProductsService.deleteById(id);

  return !deleteResponse.error
    ? res.send(deleteResponse)
    : res.status(deleteResponse.status).send(deleteResponse);
};
