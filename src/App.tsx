// import React from "react";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";

import { Demo } from "./pages/demo/Demo";
import LoginForm from "./components/LoginForm";
import Home from "./components/Home";
import Footer from "./components/UI-Components/Footer";

const Layout = ({ children }) => {
  return (
    <div className="main-wrapper">
      {children}
      <Footer />
    </div>
  );
};


function App() {
  return (
    <Layout>
    <Router>
      <Switch>
        <Route exact path="/demo" component={Demo} />
        <Route exact path="/login" component={LoginForm} />
        <Route exact path="/home" component={Home} />
        <Redirect from="/" to="/login" />
      </Switch>
    </Router>
    </Layout>
  );
}

export default App;
