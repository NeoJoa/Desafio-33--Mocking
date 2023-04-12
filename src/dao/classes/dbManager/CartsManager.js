import ProductManager from "./ProductsManager.js";
import cartModel from "../../models/carts.model.js";
import ticketModel from "../../models/ticket.model.js";
import { faker } from "@faker-js/faker";

const dbpm = new ProductManager();

export default class CartsManager {
  constructor() {}

  async getAll() {
    try {
      const carts = await cartModel.find().populate("products.pid");
      return !carts.length
        ? {
            status: 404,
            error: "No carts found",
          }
        : carts;
    } catch (error) {
      return {
        status: 500,
        error: "An error occurred while obtaining the carts",
      };
    }
  }

  async getById(id) {
    try {
      const cart = await cartModel.findById(id).lean().populate("products.pid");
      if (cart === null)
        return {
          status: 404,
          error: `Cart with id ${id} not found`,
        };
      const cartProducts = cart.products.map((cartProduct) => {
        const productPid = { ...cartProduct.pid };
        const quantity = cartProduct.quantity;
        return { ...productPid, quantity };
      });
      return cartProducts;
    } catch (error) {
      console.log(error);
      return {
        status: 500,
        error: `An error occurred while obtaining the cart with id ${id}`,
      };
    }
  }

  async post() {
    try {
      return await cartModel.create({ products: [] });
    } catch (error) {
      return {
        status: 500,
        error: "An error occurred while creating the cart",
      };
    }
  }

  async postProductToCart(cid, pid) {
    try {
      const cartFinded = await this.getById(cid);
      if (cartFinded.error)
        return {
          status: 404,
          error: `Cart with id ${cid} not found`,
        };

      const productFinded = await dbpm.getById(pid);
      if (productFinded.error)
        return {
          status: 404,
          error: `Product with id ${pid} not found`,
        };

      const productInCart = cartFinded.find(
        (product) => product.pid._id == pid
      );
      if (productInCart) {
        const productIndex = cartFinded.findIndex(
          (product) => product.pid._id == pid
        );
        const newCart = cartFinded;
        newCart[productIndex].quantity++;
        return await cartModel.findByIdAndUpdate(cid, { products: newCart });
      }

      return await cartModel.findByIdAndUpdate(cid, {
        $push: { products: { pid, quantity: 1 } },
      });
    } catch (error) {
      console.log(error);
      return {
        status: 500,
        error: `An error occurred while adding the product`,
      };
    }
  }

  async putProducts(cid, products) {
    try {
      const cartFinded = await this.getById(cid);
      if (cartFinded.error) return cartFinded;

      const dbProducts = (await dbpm.getAll()).payload.map((product) =>
        product._id.toString()
      );

      const productsExist = products.map((product) => {
        const result = dbProducts.find((dbProduct) => dbProduct == product.pid);
        return result ? true : false;
      });

      if (productsExist.includes(false))
        return {
          status: 404,
          error: "Error when trying to add a non-existent product to the cart",
        };

      await this.deleteProducts(cid);
      await cartModel.findByIdAndUpdate(cid, { products: products });
      return { status: "success", message: "Cart updated successfully" };
    } catch (error) {
      return {
        status: 500,
        error: `An error occurred while updating the cart with id ${cid}`,
      };
    }
  }

  async putProductQuantity(cid, pid, quantity) {
    try {
      if (typeof quantity !== "number")
        return { status: 400, error: "the amount must be a number" };

      const cartFinded = await this.getById(cid);
      if (cartFinded.error) return cartFinded;

      const productFinded = await dbpm.getById(pid);
      if (productFinded.error)
        return {
          status: 404,
          error: `Product with id ${pid} not found`,
        };

      const productInCart = cartFinded.find(
        (product) => product.pid._id == pid
      );
      if (productInCart) {
        const productIndex = cartFinded.findIndex(
          (product) => product.pid._id == pid
        );
        const newCart = [...cartFinded];
        newCart[productIndex].quantity = quantity;

        await cartModel.findByIdAndUpdate(cid, { products: newCart });
        return {
          status: "success",
          message: "The quantity updated successfully",
        };
      }
      return {
        status: 404,
        error: `The product with id ${pid} was not found in the cart with id ${cid}`,
      };
    } catch (error) {
      return {
        status: 500,
        error: "An error occurred while updating the quantity",
      };
    }
  }

  async deleteProductToCart(cid, pid) {
    try {
      const cartFinded = await this.getById(cid);
      if (cartFinded.error)
        return {
          status: 404,
          error: `Cart with id ${cid} not found`,
        };

      const productInCart = cartFinded.find(
        (product) => product.pid._id == pid
      );

      if (productInCart) {
        await cartModel.findByIdAndUpdate(cid, {
          $pull: { products: { pid } },
        });
        return { status: "success", message: "Product deleted successfully" };
      }
      return {
        status: 404,
        error: `The product with id ${pid} was not found in the cart with id ${cid}`,
      };
    } catch (error) {
      return {
        status: 500,
        error: `An error occurred while deleting the product with id ${pid}`,
      };
    }
  }

  async deleteProducts(cid) {
    try {
      const cartFinded = await this.getById(cid);
      if (cartFinded.error)
        return {
          status: 404,
          error: `Cart with id ${cid} not found`,
        };

      await cartModel.findByIdAndUpdate(cid, { products: [] });
      return { status: "success", message: "All product deleted successfully" };
    } catch (error) {
      return {
        status: 500,
        error: `An error occurred while deleting products`,
      };
    }
  }

  async deleteById(cid) {
    try {
      const cartDeleted = await cartModel.findByIdAndDelete(cid);
      return cartDeleted === null
        ? {
            status: 404,
            error: `Cart with id ${cid} not found`,
          }
        : {
            status: "success",
            message: `Cart with id ${cid} deleted successfully`,
          };
    } catch (error) {
      return {
        status: 500,
        error: `An error occurred while deleting products`,
      };
    }
  }

  async purchase(cid, purchaser) {
    try {
      const productsInCart = await this.getById(cid);

      if (productsInCart.error)
        return {
          status: 404,
          error: `Cart with id ${cid} not found`,
        };

      const existProductOutStock = Boolean(
        productsInCart.find((product) => product.pid.stock < product.quantity)
      );

      if (existProductOutStock)
        return { status: 400, message: "Exist product out stock" };

      let totalAmount = 0;

      for (const product of productsInCart) {
        const newStock = product.pid.stock - product.quantity;
        totalAmount += product.pid.price;
        await dbpm.putById(product.pid._id, { stock: newStock });
      }

      const ticket = await ticketModel.create({
        code: faker.database.mongodbObjectId(),
        purchaseDateTime: new Date().toLocaleString(),
        amount: totalAmount,
        purchaser: "yo",
      });
      return { payload: { ticket, productsInCart } };
    } catch (error) {
      console.log(error);
      return {
        status: 500,
        error: `An error occurred while purchase`,
      };
    }
  }
}
