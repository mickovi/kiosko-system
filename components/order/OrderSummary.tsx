"use client";
import { useStore } from "@/src/store";
import ProductOrderDetail from "./ProductOrderDetail";
import { useMemo } from "react";
import { formatCurrency } from "@/src/utils";
import { createOrder } from "@/actions/create-order-action";
import { toast } from "react-toastify";
import { OrderSchema } from "@/src/schema";

export default function OrderSummary() {
  const order = useStore((state) => state.order);
  const clearOrder = useStore((state) => state.clearOrder);
  const total = useMemo(
    () => order.reduce((total, item) => total + item.quantity * item.price, 0),
    [order]
  );

  const handleCreateOrder = async (formData: FormData) => {
    const data = {
      name: formData.get("name"),
      total,
      order,
    };
    // Validate the data from the user
    const result = OrderSchema.safeParse(data);
    console.log(result);
    if (!result.success) {
      result.error.issues.forEach((issue) => {
        toast.error(issue.message);
      });
      return;
    }

    const response = await createOrder(data);
    // Validate the response from the server
    if (!response?.errors) {
      // The error comes from the server and redered in the client
      response?.errors.forEach((issue) => {
        toast.error(issue.message);
      });
    }

    toast.success("Se ha confirmado tu pedido");
    clearOrder();
  };

  return (
    <aside className="lg:h-screen lg:overflow-y-scroll md:w-64 lg:w-96 p-5">
      <h1 className="text-4xl text-center font-black">My Order</h1>
      {order.length === 0 ? (
        <p className="text-center my-10">El carro esta vacio</p>
      ) : (
        <div className="mt-5">
          {order.map((item) => (
            <ProductOrderDetail key={item.id} item={item} />
          ))}
          <p className="text-2xl mt-20 text-center">
            Total a pagar:{" "}
            <span className="font-bold">{formatCurrency(total)}</span>
          </p>
          <form action={handleCreateOrder} className="w-full mt-10 space-y-5">
            <input
              type="text"
              name="name"
              className="bg-white border border-gray-100 p-2 w-full"
              placeholder="Tu nombre"
            />
            <input
              type="submit"
              value="Confirmar pedido"
              className="py-2 rounded uppercase text-white bg-black w-full text-center cursor-pointer"
            />
          </form>
        </div>
      )}
    </aside>
  );
}
