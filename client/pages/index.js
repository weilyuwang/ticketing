const LandingPage = ({ currentUser }) => {
  return currentUser ? (
    <h1> You are signed in </h1>
  ) : (
    <h1> You are not signed in </h1>
  );
};

// executed during the SSR process
LandingPage.getInitialProps = async (context, client, currentUser) => {
  return {};
};

export default LandingPage;
