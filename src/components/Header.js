import { Link } from "react-router-dom";
import { LOGO_URL } from "../utils/constant";

export const Header = () => (
  <div className="header">
    <div className="container">
      <img
        className="logo"
        src={`${LOGO_URL}`}
      />
      <div className="nav-items">
        <ul>
          <li>
            <Link to={"/"}>Home</Link></li>
          <li><Link to={"/about"}>About Us</Link></li>
          <li><Link >Constact Us</Link></li>
          <li><Link >Cart</Link></li>
        </ul>
      </div>
    </div>
  </div>
);
