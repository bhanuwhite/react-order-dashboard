import React from "react";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import Footer from "../components/shared/Footer";
import LoginForm from "../components/LoginForm";
import Home from "../components/Home";
import Secured  from "../secured";

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
          <Route exact path="/secured" component={Secured} />
          <Route exact path="/login" component={LoginForm} />
          <Route exact path="/home" component={Home} />
          <Redirect from="/" to="/login" />
        </Switch>
      </Router>
    </Layout>
  );
};

export default AppRoutes;
