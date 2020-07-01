import axios from "axios";

// a pre-configured axios client
// receive a context object that has a key 'req', which contains the request-related properties
export default ({ req }) => {
  // first check what environment we are in: browser or server
  if (typeof window === "undefined") {
    // we are on the server
    return axios.create({
      baseURL:
        "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local",
      headers: req.headers,
    });
  } else {
    // We must be on the browser
    // Browsers gonna take care of the headers for us
    return axios.create({
      baseURL: "/",
    });
  }
};
