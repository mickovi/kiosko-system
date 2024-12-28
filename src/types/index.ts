import { Order, Product, OrderProduct } from "@prisma/client";

export enum OrderQuantity {
  "+",
  "-",
}

export type OrderItem = Pick<Product, "id" | "name" | "price"> & {
  quantity: number;
  subtotal: number;
};

export type OrderWithProducts = Order & {
  orderProducts: (OrderProduct & {
    product: Product;
  })[];
};
