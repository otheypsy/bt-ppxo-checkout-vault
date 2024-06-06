import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from "react-router-dom";
import { useGetClientInstance } from "./states/ClientInstance/ClientInstanceHooks";
import { useGetAlert } from "./states/Alert/AlertHooks";
import BTClientInstance from "./components/BTClientInstance";
import BTPwPPCheckoutVault from "./components/BTPwPPCheckoutVault";

const _routes = [
  {
    Component: BTClientInstance,
    label: "Credentials",
    path: "/credentials",
    isDep: false
  },
  {
    Component: BTPwPPCheckoutVault,
    label: "CheckoutVault",
    path: "/checkout-vault",
    isDep: true
  }
];

const BraintreeApp = () => {
  const clientInstance = useGetClientInstance();
  const alert = useGetAlert();

  const finalRoutes = _routes.filter((route) => {
    if (route.isDep && !clientInstance) return false;
    return true;
  });

  return (
    <Router>
      <nav className="navbar navbar-light bg-light">
        <span className="navbar-brand mb-0 h1">
          <img
            className="pr-1"
            src="https://www.paypalobjects.com/webstatic/icon/favicon.ico"
            width="30"
            height="30"
            alt=""
          />
          Braintree ~ PwPP ~ Vault
        </span>
        <div className="nav">
          {finalRoutes.map((route) => (
            <span key={route.path} className="nav-link">
              <Link to={route.path}>{route.label}</Link>
            </span>
          ))}
        </div>
      </nav>
      <br />
      <div className="container-fluid">
        <Switch>
          {finalRoutes.map((route) => (
            <Route key={route.path} path={route.path}>
              <route.Component />
            </Route>
          ))}
          <Route path="*">
            <Redirect to="/credentials" />
          </Route>
        </Switch>
        <br />
        <br />
        <div className={"alert alert-" + alert.type} role="alert">
          {alert.message}
        </div>
      </div>
    </Router>
  );
};

export default BraintreeApp;
