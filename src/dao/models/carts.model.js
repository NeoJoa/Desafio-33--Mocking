import mongoose from "mongoose";

const cartsCollection = "carts";

const cartSchema = new mongoose.Schema(
  {
    products: {
      type: [
        {
          pid: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "products",
            required: true,
          },
          quantity: {
            type: Number,
            required: true,
            default: 1,
          },
        },
      ],
      default: [],
      required: true,
    },
  },
  { versionKey: false }
);

const cartModel = mongoose.model(cartsCollection, cartSchema);
export default cartModel;
