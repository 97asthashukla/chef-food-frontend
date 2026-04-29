import { Link } from "react-router-dom";
import { LOGO_URL } from "../utils/constant";
import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { LocationSelector } from "./LocationSelector";

export const Header = () => {
  const { getTotalItems } = useContext(CartContext);
  const cartCount = getTotalItems();

  return (
    <div className="header">
      <div className="container">
        <img
          className="logo"
          src={`${LOGO_URL}`}
          alt="Logo"
        />
        <LocationSelector />
        <div className="nav-items">
          <ul>
            <li>
              <Link to={"/"}>Home</Link></li>
            <li><Link to={"/about"}>About Us</Link></li>
            <li><Link to={"/contact"}>Contact Us</Link></li>
            <li className="cart-link">
              <Link to={"/cart"}>
                🛒 Cart
                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
