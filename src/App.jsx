import { Outlet } from "react-router-dom"
import Navbar from "./Conponents/Navbar"
import { Footer } from "./Conponents/Footer"
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';



function App() {


  return (
    <>
   <Navbar></Navbar>
   <div className="">
   <Outlet></Outlet>

   </div>
   <Footer></Footer>
   <ToastContainer />
    </>
  )
}

export default App
