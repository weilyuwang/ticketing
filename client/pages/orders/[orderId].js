import { useEffect, useState } from "react";
import StripeCheckout from "react-stripe-checkout";
import Warning from "../../components/warning";

const STRIPE_PUBLIC_KEY =
  "pk_test_51GzmrmEfLuseb67nBpvjxHmep8tGxj8DNiLHC48E8481QYlshdSXYNiDDpK60SdYDySNZ6tzn1vM5k3xwdXjOnqo0067GjfmxI";

const OrderShow = ({ currentUser, order }) => {
  const [timeLeft, setTimeLeft] = useState(0);

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

  if (timeLeft < 0) {
    return <div>Order Expired</div>;
  }

  return (
    <div>
      <h3>Time left to pay: {timeLeft} seconds</h3>
      <Warning />
      <StripeCheckout
        token={(token) => console.log(token)}
        stripeKey={STRIPE_PUBLIC_KEY}
        amount={order.ticket.price * 100}
        email={currentUser.email}
      />
    </div>
  );
};

OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);

  return { order: data };
};

export default OrderShow;
