/* eslint-disable jsx-a11y/anchor-is-valid */
const Footer = () => {
  return (
    <div className="footer-wrapper">
      <div className="privacy-block flex justify-between">
        <div>
          <ul className="widget-links">
            <li>
              <a href="">Service Status</a>
            </li>
            <li>
              <a href="">Contact Support</a>
            </li>
          </ul>
        </div>
        <div>
          <ul className="widget-links">
            <li>
              <a href="">Terms of Use</a>
            </li>
            <li>
              <a href="">Privacy Policy</a>
            </li>
            <li>
              <a href="">EULA</a>
            </li>
            <li>
              <a href="">Limited Warranty</a>
            </li>
            <li className="mb-8 sm:mb-0">
              <a href="">4G Faileovers Terms</a>
            </li>
          </ul>
        </div>
      </div>
      <p className="copy-right">@2020 Veea Inc. All Rigts Reserved.</p>
      <p>
        VeeHub is a trademark of Veea Inc. All other trademarks and tradenames are the property of their respective
        owners.{" "}
      </p>
    </div>
  );
};

export default Footer;
