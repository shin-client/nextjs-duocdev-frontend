import OrdersCart from "./orders-cart";

const OrdersPage = () => {
  return (
    <div className="mx-auto max-w-[400px] w-full space-y-4">
      <h1 className="text-center text-xl font-bold">Thanh toán</h1>
      <OrdersCart />
    </div>
  );
};
export default OrdersPage;
