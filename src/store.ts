import { create } from "zustand";
import { OrderItem, OrderQuantity } from "./types";
import { Product } from "@prisma/client";

interface Store {
  order: OrderItem[];
  addToOrder: (product: Product) => void;
  modifyQuantity: (id: Product["id"], type: OrderQuantity) => void;
  removeItem: (id: Product["id"]) => void;
  clearOrder: () => void;
}

export const useStore = create<Store>((set, get) => ({
  order: [],
  addToOrder: (product) => {
    const { categoryId, image, ...data } = product;
    let order: OrderItem[] = [];
    const productInCart = get().order.find((item) => item.id === product.id);
    if (productInCart) {
      order = get().order.map((item) =>
        item.id === product.id
          ? {
              ...item,
              quantity: item.quantity + 1,
              subtotal: item.price + (item.quantity + 1),
            }
          : item
      );
    } else {
      order = [
        ...get().order,
        {
          ...data,
          quantity: 1,
          subtotal: product.price,
        },
      ];
    }
    set(() => ({
      order,
    }));
  },
  modifyQuantity: (id, type) => {
    set((state) => ({
      order: state.order.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity:
                type === OrderQuantity["+"]
                  ? item.quantity + 1
                  : item.quantity - 1,
              subtotal:
                type === OrderQuantity["+"]
                  ? item.price * (item.quantity + 1)
                  : item.price * (item.quantity - 1),
            }
          : item
      ),
    }));
  },
  removeItem: (id) => {
    set((state) => ({
      order: state.order.filter((item) => item.id !== id),
    }));
  },
  clearOrder: () => set(() => ({ order: [] })),
}));
