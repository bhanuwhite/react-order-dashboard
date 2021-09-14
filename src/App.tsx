// import React from "react";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";

import { Demo } from "./pages/demo/Demo";
import LoginForm from "./components/LoginForm";
import Home from "./components/Home";
import Orders from "./components/Orders";
import OrderView from "./components/OrderView";
import EntitiesView from "./components/EntitiesView";
import Products from "./components/Products";
import ProductsView from "./components/ProductsView";
import ViewOrderLine from "./components/ViewOrderLine";
import Settings from "./components/Settings";
import Entities from "./components/Entities";
const Layout = ({ children }) => {
  return (
    <div className="main-wrapper h-screen">
      {children}
      {/* <Footer /> */}
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
        <Route exact path="/orders" component={Orders} />
        <Route exact path="/orderview" component={OrderView} />
        <Route exact path="/entitiesview" component={EntitiesView} />
        <Route exact path="/products" component={Products} />
        <Route exact path="/productsview" component={ProductsView} />
        <Route exact path="/vieworderline" component={ViewOrderLine} />
        <Route exact path="/settings" component={Settings} />
        <Route exact path="/entities" component={Entities} />
        <Redirect from="/" to="/login" />
      </Switch>
    </Router>
    </Layout>
  );
}

export default App;
