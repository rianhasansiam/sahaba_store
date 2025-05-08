import { Outlet } from "react-router-dom"
import Navbar from "./Conponents/Navbar"
import { Footer } from "./Conponents/Footer"


function App() {


  return (
    <>
   <Navbar></Navbar>
   <Outlet></Outlet>
   <Footer></Footer>
    </>
  )
}

export default App
