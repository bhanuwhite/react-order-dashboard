/* eslint-disable jsx-a11y/anchor-is-valid */
import adEdgeLogo from "../assets/imgs/logo2.svg";
import {
  Button  
} from "../core/components";
import Footer from "../components/UI-Components/Footer";

const LoginForm = () => {
  return (
    <>
    <div className="login-wrapper">
          <div className="login-image"></div>
          <div className="login-form">
            <div className="login-block">
              <img src={adEdgeLogo} alt="AdEdge Logo" />
              <h2 className="welcome-heading">Welcome</h2>
              <p className="welcome-text">Use your Veea ID to access AdEdge Order Center</p>
              <form action="" method="">
                <div className="full-input">
                  <label>e-mail address</label>
                  <input id="primary-input" type="email" name="email" placeholder="required" required />
                </div>
                <div className="full-input">
                  <label>password</label>
                  <input id="primary-input" type="password" name="password" placeholder="required" required />
                </div>
                <Button className="login-button">Login</Button>
              </form>
              <a href="" className="forgot-password">
                Forgot Your Password?
              </a>
            </div>
          </div>
    </div>
    <Footer />
    </>
  );
};

export default LoginForm;
