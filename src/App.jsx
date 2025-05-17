import { Outlet } from "react-router-dom"
import Navbar from "./Conponents/Navbar"
import { Footer } from "./Conponents/Footer"
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { useContext } from "react";
import { contextData } from "./Contex";
import LoadingPage from "./Conponents/LoadingPage";



function App() {

const {loading}=useContext(contextData)


if(loading) return <LoadingPage></LoadingPage>
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
