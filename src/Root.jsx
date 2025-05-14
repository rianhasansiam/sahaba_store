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
import Adminpage from "./Page/AdminPannel/Adminpage";
import Dashboard from "./Page/AdminPannel/Dashboard";
import AllUsers from "./Page/AdminPannel/AllUsers";
import AllOrders from "./Page/AdminPannel/AllOrders";
import AllCategories from "./Page/AdminPannel/AllCategories";
import AllProducts from "./Page/AdminPannel/AllProducts";
import CouponManagement from "./Page/AdminPannel/CouponManagement";



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



      {
  path: '/adminpage',
  element: <Adminpage />,
  children: [
    { path: 'dashboard', element: <Dashboard></Dashboard> },
    { path: 'allusers', element: <AllUsers></AllUsers> },
    { path: 'allorders', element: <AllOrders ></AllOrders>},
    { path: 'allcategories', element: <AllCategories></AllCategories> },
    { path: 'allproducts', element: <AllProducts></AllProducts>},
    { path: 'cuponcodes', element: <CouponManagement></CouponManagement> },
  ]
},




    ]
  },

  
]);
export default Root