import "./index.css";
import ReactDOM from "react-dom/client";
import { Header } from "./components/Header";
import { Body } from "./components/Body";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import { About } from "./components/About";
import { Error } from "./components/Error";
import { RestaurantMenu } from "./components/RestaurantMenu";


const AppComponent = () => (
  <div className="app">
    <Header />
    <Outlet />
  </div>
);

const appRouter = createBrowserRouter([
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
        path:'/about',
        element:<About/>
      }
    ],
    errorElement:<Error/>
  },
], {
  basename: '/chef-food-frontend'
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<RouterProvider router={appRouter} />);
