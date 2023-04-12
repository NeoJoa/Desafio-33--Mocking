import fs from "fs";
import { faker } from "@faker-js/faker";
import ProductManager from "./productManager.js";
const pm = new ProductManager();

export default class CartsManager {
  constructor() {
    this.path = "src/dao/classes/fileManager/cartBase.json";
  }

  async post() {
    try {
      const carts = await this.getAll();
      if (carts.error) return carts;
      const newCart = { id: faker.database.mongodbObjectId(), products: [] };
      carts.push(newCart);
      await this.writeFile(carts);
      return {
        status: "success",
        message: `Carts posted successfully`,
        id: newCart.id,
      };
    } catch (error) {
      console.log(error);
      return { status: 500, error: "Error from server" };
    }
  }

  async getAll() {
    try {
      const document = await fs.promises.readFile(this.path);
      const carts = JSON.parse(document);
      return carts;
    } catch (error) {
      console.log(error);
      return {
        status: 500,
        error:
          "An error has occurred at moment of read the file, this error is from server and we're working on resolve the problem.",
      };
    }
  }

  async getById(id) {
    try {
      const carts = await this.getAll();
      if (carts.error) return carts;
      const cart = carts.find((dbCart) => dbCart.id === id);
      if (!cart) return { status: 404, error: "Cart not found" };
      const cartPopulate = [];
      for (let product of cart.products) {
        const dbProduct = await pm.getById(product.id);
        const productPopulate = { ...dbProduct, quantity: product.quantity };
        cartPopulate.push(productPopulate);
      }
      return cartPopulate;
    } catch (error) {
      console.log(error);
      return { status: 500, error: "Error from server" };
    }
  }

  async postProductToCart(cid, pid) {
    try {
      const carts = await this.getAll();
      if (carts.error) return carts;
      const cart = await this.getById(cid);
      if (cart.error) return cart;
      const cartIndex = carts.findIndex((dbCart) => dbCart.id === cid);
      const productFinded = cart.find((dbProduct) => dbProduct.id === pid);
      if (productFinded) {
        const productIndex = cart.findIndex(
          (dbProduct) => dbProduct.id === pid
        );
        productFinded.quantity++;
        cart.splice(productIndex, 1, productFinded);
        carts.splice(cartIndex, 1, cart);
        await this.writeFile(carts);
        return {
          status: "Success",
          message: "Quantity of product icreased successfully",
        };
      }
      const getProduct = await pm.getById(pid);
      if (getProduct.error) return getProduct;
      cart.push({ id: pid, quantity: 1 });
      carts.splice(cartIndex, 1, { id: cid, products: cart });
      await this.writeFile(carts);
      return {
        status: "success",
        message: "Product posted to cart successfully",
      };
    } catch (error) {
      console.log(error);
      return { status: 500, error: "Error from server" };
    }
  }

  async deleteProductToCart(cid, pid) {
    try {
      const carts = await this.getAll();
      if (carts.error) return carts;
      const cart = await this.getById(cid);
      if (cart.error) return cart;
      const cartIndex = carts.find((dbCart) => dbCart.id === cid);
      const product = cart.find((dbProduct) => dbProduct.id === pid);
      if (!product) return { status: 404, error: "Product not found" };
      const productIndex = cart.findIndex((dbProduct) => dbProduct.id === pid);
      cart.splice(productIndex, 1);
      carts.splice(cartIndex, 1, cart);
      await this.writeFile(carts);
      return { status: "Ok", message: "Product removed from cart succesfully" };
    } catch (error) {
      console.log(error);
      return { status: 500, error: "Error from server" };
    }
  }

  async deleteProducts(cid) {
    try {
      const carts = await this.getAll();
      if (carts.error) return carts;
      const cart = await this.getById(cid);
      if (cart.error) return cart;
      const cartIndex = carts.findIndex((dbCart) => dbCart.id === cid);
      cart = [];
      carts.splice(cartIndex, 1, cart);
      await this.writeFile(carts);
      return { status: "success", message: "Products deleted successfull" };
    } catch (error) {
      console.log(error);
      return { status: 500, error: "Error from server" };
    }
  }

  async putProducts(cid, products) {
    try {
      const carts = await this.getAll();
      if (carts.error) return carts;
      const cart = await this.getById(cid);
      if (cart.error) return cart;
      const cartIndex = carts.findIndex((dbCart) => dbCart.id === cid);
      cart = products;
      carts.splice(cartIndex, 1, cart);
      await this.writeFile(carts);
      return { status: "success", message: "Products actualized successfull" };
    } catch (error) {
      console.log(error);
      return { status: 500, error: "Error from server" };
    }
  }

  async putProductQuantity(cid, pid, quantity) {
    try {
      const carts = await this.getAll();
      if (carts.error) return carts;
      const cart = await this.getById(cid);
      if (cart.error) return cart;
      const cartIndex = carts.findIndex((dbCart) => dbCart.id === cid);
      const productFinded = cart.find((dbProduct) => dbProduct.id === pid);
      if (!productFinded) return { status: 404, error: "Product not found" };
      const productIndex = cart.findIndex((dbProduct) => dbProduct.id === pid);
      cart[productIndex].quantity = quantity;
      carts.splice(cartIndex, 1, cart);
      await this.writeFile(carts);
      return {
        status: "success",
        message: "Products quantity updated successfully",
      };
    } catch (error) {
      console.log(error);
      return { status: 500, error: "Error from server" };
    }
  }

  async deleteProductToCart(cid, pid) {
    try {
      const carts = await this.getAll();
      if (carts.error) return carts;
      const cart = await this.getById(cid);
      if (cart.error) return cart;
      const cartIndex = carts.findIndex((dbCart) => dbCart.id === cid);
      const productFinded = cart.find((dbProduct) => dbProduct.id === pid);
      if (!productFinded) return { status: 404, error: "Product not found" };
      const productIndex = cart.findIndex((dbProduct) => dbProduct.id === pid);
      cart.splice(productIndex, 1);
      carts.splice(cartIndex, 1, cart);
      await this.writeFile(carts);
      return {
        status: "success",
        message: "Product deleted from cart successfully",
      };
    } catch (error) {
      console.log(error);
      return { status: 500, error: "Error from server" };
    }
  }

  async deleteById(cid) {
    try {
      const carts = await this.getAll();
      if (carts.error) return carts;
      const cart = await this.getById(cid);
      if (cart.error) return cart;
      const cartIndex = carts.findIndex((dbCart) => dbCart.id === cid);
      carts.splice(cartIndex, 1);
      await this.writeFile(carts);
      return { status: "success", message: "Cart deleted successfully" };
    } catch (error) {
      console.log(error);
      return { status: 500, error: "Error from server" };
    }
  }

  async purchase(cid, purchaser) {
    try {
      const cart = await this.getById(cid);
      if (cart.error) return cart;

      const productsInCart = cart;
      const existProductOutStock = Boolean(
        productsInCart.find((product) => product.stock < product.quantity)
      );

      if (existProductOutStock)
        return { status: 400, message: "Exist product out stock" };

      let totalAmount = 0;

      for (const product of productsInCart) {
        const newStock = product.stock - product.quantity;
        totalAmount += product.price;
        const response = await pm.putById(product.id, { stock: newStock });
      }

      const ticket = {
        code: faker.database.mongodbObjectId(),
        purchaseDateTime: new Date().toLocaleString(),
        amount: totalAmount,
        purchaser: "yo",
      };
      return { status: "success", payload: { ticket, productsInCart } };
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
