import buildClient from "../api/buildClient";

const LandingPage = ({ currentUser }) => {
  console.log(currentUser);

  return <h1>Landing page</h1>;
};

// executed during the SSR process
LandingPage.getInitialProps = async (context) => {
  const client = buildClient(context);

  const response = await client.get("/api/users/currentuser");

  return response.data;
};

export default LandingPage;
