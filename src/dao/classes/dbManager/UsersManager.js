import usersModel from "../../models/users.model.js";
export default class UsersManager {
  constructor() {}

  async post(user) {
    try {
      return await usersModel.create(user);
    } catch (error) {
      return {
        status: 500,
        error: "An error occurred while creating the user",
      };
    }
  }

  async getAll() {
    try {
      if (query) query = JSON.parse(query);
      return await usersModel.find().lean();
    } catch (error) {
      return {
        status: 500,
        error:
          "An error has occurred at moment of read the database, this error is from server and we're working on resolve the problem.",
      };
    }
  }

  async getBy(param) {
    try {
      const user = await usersModel.findOne(param).lean();
      return user;
    } catch (error) {
      return {
        status: 500,
        error: `An error occurred while obtaining the user`,
      };
    }
  }

  async putBy(param, object) {
    try {
      const productUpdated = await usersModel.findOneAndUpdate(param, object, {
        new: true,
      });
      return productUpdated === null
        ? {
            status: 404,
            error: `Product with id ${id} not found`,
          }
        : productUpdated;
    } catch (error) {
      return {
        status: 500,
        error: `Error from server`,
      };
    }
  }

  async deleteBy(param) {
    try {
      const productDeleted = await usersModel.findByIdAndDelete(id);
      return productDeleted === null
        ? {
            status: 404,
            error: `User not found`,
          }
        : { status: 200, message: `User deleted succesfully` };
    } catch (error) {
      return {
        status: 500,
        error: `Error from server`,
      };
    }
  }
}
