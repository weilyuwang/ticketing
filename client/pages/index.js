import axios from "axios";

const LandingPage = ({ currentUser }) => {
  console.log(currentUser);

  return <h1>Landing page</h1>;
};

// executed during the SSR process
LandingPage.getInitialProps = async () => {
  // make the request on the server
  const response = await axios.get("/api/users/currentUser");

  return response.data;
};

export default LandingPage;
