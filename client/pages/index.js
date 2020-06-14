import buildClient from "../api/buildClient";

const LandingPage = ({ currentUser }) => {
  return currentUser ? (
    <h1>You are signed in</h1>
  ) : (
    <h1>You are not signed in</h1>
  );
};

// executed during the SSR process
LandingPage.getInitialProps = async (context) => {
  const client = buildClient(context);

  const response = await client.get("/api/users/currentuser");

  return response.data;
};

export default LandingPage;
