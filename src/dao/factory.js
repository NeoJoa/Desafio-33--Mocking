import mongoose from "mongoose";
import config from "../config/config.js";

export let Carts;
export let Products;
export let Users;

switch (config.persistence) {
  case "mongodb":
    mongoose.set("strictQuery", false);
    mongoose.connect(config.mongoUrl, (error) => {
      if (error) {
        console.log("No hubo conexion", error);
        process.exit();
      }
      console.log("Conection with mongodb success");
    });
    const { default: CartsMongo } = await import(
      "./classes/dbManager/CartsManager.js"
    );
    const { default: ProductsMongo } = await import(
      "./classes/dbManager/ProductsManager.js"
    );
    const { default: UsersMongo } = await import(
      "./classes/dbManager/UsersManager.js"
    );

    Carts = CartsMongo;
    Products = ProductsMongo;
    Users = UsersMongo;
    break;

  case "filesystem":
    console.log("Working with filesystem");

    const { default: CartsMemory } = await import(
      "./classes/fileManager/cartsManager.js"
    );
    const { default: ProductsMemory } = await import(
      "./classes/fileManager/productManager.js"
    );
    const { default: UsersMemory } = await import(
      "./classes/fileManager/usersManager.js"
    );

    Carts = CartsMemory;
    Products = ProductsMemory;
    Users = UsersMemory;
    break;
}
