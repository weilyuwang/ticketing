import "bootstrap/dist/css/bootstrap.css";
import buildClient from "../api/buildClient";
import Header from "../components/header";

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      <Header currentUser={currentUser} />
      <div className="container">
        <Component currentUser={currentUser} {...pageProps} />
      </div>
    </div>
  );
};

AppComponent.getInitialProps = async (appContext) => {
  // appContext = { Compoennt: { getInitialProps: ___ }, ctx: {req, res}, ... }

  const client = buildClient(appContext.ctx);
  const { data } = await client.get("/api/users/currentuser");

  let pageProps = {};

  // if child component has getInitialProps func defined,
  // invoke the child component's getInitialProps func from here
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(
      appContext.ctx,
      client,
      data.currentUser
    );
  }

  return {
    pageProps,
    currentUser: data.currentUser,
  };
};

export default AppComponent;
