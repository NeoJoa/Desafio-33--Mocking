import fs from "fs";
import { faker } from "@faker-js/faker";

export default class CartsManager {
  constructor() {
    this.path = "src/dao/classes/fileManager/users.json";
  }

  async post(user) {
    try {
      const users = await this.getAll();
      if (users.error) return users;
      const existEmail = users.find((dbUser) => dbUser.email === user.email);
      if (existEmail)
        return {
          status: 400,
          error: "Already exist a user registered with this email",
        };
      const newUser = { id: faker.database.mongodbObjectId(), ...user };
      users.push(newUser);
      await this.writeFile(users);
      return { status: "success", message: "User posted successfull" };
    } catch (error) {
      console.log(error);
    }
    return { status: 500, error: "Error from server" };
  }

  async getAll() {
    try {
      const document = await fs.promises.readFile(this.path);
      const users = JSON.parse(document);
      return users;
    } catch (error) {
      console.log(error);
      return {
        status: 500,
        error:
          "An error has occurred at moment of read the file, this error is from server and we're working on resolve the problem.",
      };
    }
  }

  async getBy(param) {
    try {
      const users = await this.getAll();
      if (users.error) return users;
      const prop = Object.keys(param)[0];
      const value = param[prop];
      const user = users.find((dbUser) => dbUser[prop] === value);
      if (!user) return { status: 404, error: "User not found" };
      return user;
    } catch (error) {
      console.log(error);
      return { status: 500, error: "Error from server" };
    }
  }

  async putBy(param, object) {
    try {
      const users = await this.getAll();
      if (users.error) return users;
      let user = await this.getBy(param);
      if (user.error) return user;
      const entries = Object.entries(object).filter((array) => array[1]);
      for (const entry of entries) {
        const prop = entry[0];
        const value = entry[1];
        user[prop] = value;
      }
      const userIndex = users.findIndex((dbUser) => dbUser.id === user.id);
      users.splice(userIndex, 1, user);
      await this.writeFile(users);
      return { status: "success", message: "User actualized successfull" };
    } catch (error) {
      console.log(error);
      return { status: 500, error: "Error from server" };
    }
  }

  async deleteBy(param) {
    try {
      const users = await this.getAll();
      if (users.error) return users;
      const user = await this.getBy(param);
      if (!user) return { status: 404, error: "User not found" };
      const userIndex = users.findIndex((dbUser) => dbUser.id === user.id);
      users.splice(userIndex, 1);
      await this.writeFile(users);
      return { status: "success", message: "User deleted successfull" };
    } catch (error) {
      console.log(error);
      return { status: 500, error: "Error from server" };
    }
  }

  async writeFile(data) {
    try {
      await fs.promises.writeFile(this.path, JSON.stringify(data));
      return { status: "Ok", message: "Added successfully" };
    } catch (error) {
      return {
        status: 500,
        error:
          "An error has occurred at moment of write the file, this error is from server and we're working on resolve the problem.",
      };
    }
  }
}
