import axios from "axios";

const LandingPage = ({ currentUser }) => {
  console.log(currentUser);

  return <h1>Landing page</h1>;
};

// executed during the SSR process
LandingPage.getInitialProps = async () => {
  if (typeof window === "undefined") {
    // we are on the server!
    // requests should be made to 'http://SERVICENAME.NAMESPACE.svc.cluster.local' (cross-namespace connection)
    // we also need to specify the Host header
    const { data } = await axios.get(
      "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser",
      {
        headers: {
          Host: "ticketing.dev",
        },
      }
    );

    return data;
  } else {
    // we are on the browser!
    // requests can be made with a base url of ''
    // - browser gonna automatically append the domain for us
    const { data } = await axios.get("/api/users/currentUser");
    // data = { currentUser: null } or { currentUser: {} }
    return data;
  }
};

export default LandingPage;
