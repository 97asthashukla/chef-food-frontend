import "./index.css";
import ReactDOM from "react-dom/client";
import { Header } from "./components/Header";
import { Body } from "./components/Body";
import { Cart } from "./components/Cart";
import { Checkout } from "./components/Checkout";
import { createHashRouter, Outlet, RouterProvider } from "react-router-dom";
import { About } from "./components/About";
import { Error } from "./components/Error";
import { RestaurantMenu } from "./components/RestaurantMenu";
import { CartProvider } from "./context/CartContext";


const AppComponent = () => (
  <div className="app">
    <Header />
    <Outlet />
  </div>
);

const appRouter = createHashRouter([
  {
    path:'/',
    element:<AppComponent/>,
    children:[
      {
        path:'/',
        element:<Body/>
      },
      {
        path:'/restaurant/:id',
        element:<RestaurantMenu/>
      },
      {
        path:'/cart',
        element:<Cart/>
      },
      {
        path:'/checkout',
        element:<Checkout/>
      },
      {
        path:'/about',
        element:<About/>
      }
    ],
    errorElement:<Error/>
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <CartProvider>
    <RouterProvider router={appRouter} />
  </CartProvider>
);
