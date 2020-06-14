import axios from "axios";

const LandingPage = ({ currentUser }) => {
  // console.log(currentUser);

  return <h1>Landing page</h1>;
};

// executed during the SSR process
LandingPage.getInitialProps = async () => {
  if (typeof window === "undefined") {
    // we are on the server!
    // requests should be made to http://ingress-nginx....
  } else {
    // we are on the browser!
    // requests can be made with a base url of ''
  }

  return {};
};

export default LandingPage;
