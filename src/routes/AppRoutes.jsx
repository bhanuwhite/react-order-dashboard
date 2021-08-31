import React from "react";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import Footer from "../base-components/Footer";
import LoginForm from "../base-components/LoginForm";
import Home from "../base-components/Home";
import Orders from "../base-components/Orders";
const Layout = ({ children }) => {
  return (
    <div className="main-wrapper">
      {children}
      {/* <Footer /> */}
    </div>
  );
};

const AppRoutes = () => {
  return (
    <Layout>
      <Router>
        <Switch>
          <Route exact path="/login" component={LoginForm} />
          <Route exact path="/home" component={Home} />
          <Route exact path="/orders" component={Orders} />
          <Redirect from="/" to="/orders" />
        </Switch>
      </Router>
    </Layout>
  );
};

export default AppRoutes;
