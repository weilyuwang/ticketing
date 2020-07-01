import { useEffect, useState } from "react";

const OrderShow = ({ order }) => {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(msLeft / 1000));
    };

    // setInterval has 1 second delay, so we need to manually invoke findTimeLeft func immediately
    // to show how many seconds left instantly on the page
    findTimeLeft();

    // by default, setInterval is gonna run forever until we stop it
    const timerId = setInterval(findTimeLeft, 1000);

    // return clean-up func which stops the interval
    return () => {
      clearInterval(timerId);
    };
  }, []);

  return <h1>Time left to pay: {timeLeft} seconds</h1>;
};

OrderShow.getInitialProps = async (context, client, currentUser) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);

  return { order: data };
};

export default OrderShow;
