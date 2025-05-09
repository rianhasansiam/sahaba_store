import { Outlet } from "react-router-dom"
import Navbar from "./Conponents/Navbar"
import { Footer } from "./Conponents/Footer"


function App() {


  return (
    <>
   <Navbar></Navbar>
   <div className="">
   <Outlet></Outlet>

   </div>
   <Footer></Footer>
    </>
  )
}

export default App
