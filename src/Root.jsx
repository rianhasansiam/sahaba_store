import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Home from "./Page/Home";

import One from "./Page/AllProduct/One";
import Two from "./Page/AllProduct/Two";
import Contact from "./Page/Contact";
import Wishlist from "./Page/Wishlist";


import Login from "./Page/user/Login";
import Register from "./Page/user/Register";
import AddToCart from "./Page/AddToCart";


const Root = createBrowserRouter([
  {
    path: "/",
    element: <App></App>,
    children:[

      {
        path: '/',
        element: <Home></Home>
      },
      {
        path: '/allproduct/one',
        element: <One></One>
      },
      {
        path: '/allproduct/two',
        element: <Two></Two>
      },
      {
        path: '/contact',
        element: <Contact></Contact>
      },
      {
        path: '/wishlist',
        element: <Wishlist></Wishlist>
      },
      {
        path: '/login',
        element: <Login></Login>
      },
      {
        path: '/register',
        element: <Register></Register>
      },
      {
        path: '/addtocart',
        element: <AddToCart></AddToCart>
      },
    ]
  },
]);
export default Root