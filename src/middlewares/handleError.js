import { enumErrors } from "../errors/enumErrors.js";

export default (error, req, res, next) => {
  switch (error.code) {
    case enumErrors.INVALID_FILTER:
      return res.status(error.statusCode).send({
        status: error.statusCode,
        error: error.name,
        cause: error.cause,
        message: error.message,
      });
    case enumErrors.MISSING_VALUES:
      return res.status(error.statusCode).send({
        status: error.statusCode,
        error: error.name,
        cause: error.cause,
        message: error.message,
      });
    default:
      return res.send({ status: "Error", error: "Desconocido" });
  }
};
