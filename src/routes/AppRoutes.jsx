import React from "react";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import Footer from "../components/Footer";
import LoginForm from "../components/LoginForm";

const Layout = ({ children }) => {
  return (
    <div className="main-wrapper">
      {children}
      <Footer />
    </div>
  );
};

const AppRoutes = () => {
  return (
    <Layout>
      <Router>
        <Switch>
          <Route exact path="/login" component={LoginForm} />
          <Redirect from="/" to="/login" />
        </Switch>
      </Router>
    </Layout>
  );
};

export default AppRoutes;
