import React from 'react'
import { NavLink } from 'react-router-dom'

const Navbar = () => {
  return (
    <div className='bg-[#167389]'>

        {/* Navbar here */}
        <div className="navbar container m-auto">
  <div className="navbar-start">
    <div className="dropdown">
      <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h8m-8 6h16" />
        </svg>
      </div>
      <ul
        tabIndex={0}
        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">


        <li><NavLink to="/">Home</NavLink></li>
      <li>
        <details>
          <summary>All Products</summary>
          <ul className="p-2 bg-gray-100 rounded-md">
            <li><NavLink to="/allproduct/one">one</NavLink></li>
            <li><NavLink to="/allproduct/two">two</NavLink></li>
          </ul>
        </details>
      </li>
      <li><NavLink to="/wishlist">Wishlist</NavLink></li>
      <li><NavLink to="/contact" >Contact</NavLink></li>



      </ul>
    </div>
    <a className="btn btn-ghost text-xl">daisyUI</a>
  </div>


  <div className="navbar-center hidden lg:flex text-white font-semibold">
    <ul className="menu menu-horizontal px-1">


      <li><NavLink to="/">Home</NavLink></li>
      <li>
        <details>
          <summary>All Products</summary>
          <ul className="p-2 bg-gray-100 rounded-md z-10">
            <li className='text-black'><NavLink to="/allproduct/one">one</NavLink></li>
            <li className='text-black'><NavLink to="/allproduct/two">two</NavLink></li>
          </ul>
        </details>
      </li>
      <li><NavLink to="/wishlist">Wishlist</NavLink></li>
      <li><NavLink to="/contact" >Contact</NavLink></li>


    </ul>
  </div>




  <div className="navbar-end text-white flex gap-5 text-xl">
    <button className='block '><i className="fa-solid fa-heart"></i></button>
    <button className='block '><i className="fa-solid fa-cart-shopping"></i></button>
    <button className='block '><i className="fa-solid fa-user"></i></button>
  </div>
</div>




{/* seachbar here */}
<div className="form-control w-full max-w-xs sm:max-w-md md:max-w-lg mx-auto">
  <div className="input-group flex pb-5">
    <input
      type="text"
      placeholder="Search products..."
      className="input input-bordered w-full block rounded-l-3xl rounded-r-none 
                 focus:outline-none focus:border-none focus:ring-0"
    />

    <button className="btn btn-square bg-black text-white border-none rounded-r-3xl rounded-l-none">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z"
        />
      </svg>
    </button>
  </div>
</div>




    </div>
  )
}

export default Navbar
