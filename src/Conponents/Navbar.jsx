import React, { useContext, useEffect } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { contextData } from '../Contex'
import { useFetchData } from '../hooks/useFetchData'
import logo from '../assets/img/logo2.png' 
import Searchbar from './Searchbar'
import { toast } from "react-toastify";
import LoadingPage from './LoadingPage'

const Navbar = () => {

  const { userData, signoutHandle, logoutLoading, setUserProfile } = useContext(contextData)

  const location = useLocation()


const navigate=useNavigate()


  

  // Fetch categories
  const { data: categories, isLoading: catLoading } = useFetchData('categories', '/allcategories');

  // Fetch user profile when userData is present
  const { data: userProfile, isLoading: userProfileLoading, error: userProfileError } = useFetchData(
    userData ? ['userProfile', userData.email] : null,
    userData ? `/user?email=${encodeURIComponent(userData.email)}` : '',
    { enabled: !!userData }
  );



  useEffect(() => {
    if (userProfile && setUserProfile) {
      setUserProfile(userProfile.data);
    }
  }, [userProfile, setUserProfile]);

  return (
    <div className='bg-[#167389]'>

      {/* Navbar here */}
      <div className="navbar container m-auto">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden text-white">
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
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow bg-white">
              <li><NavLink to="/">Home</NavLink></li>
              <li>
                 <details>
                <summary>All Products</summary>
                <ul className="p-2 bg-gray-100 rounded-md z-10">
                  {catLoading ? (
                   <LoadingPage></LoadingPage>
                  ) : (
                    <>
                      <li className='text-black'>
                        <NavLink to="/allproduct/all">All</NavLink>
                      </li>
                      {categories?.map((cat) => (
                        <li className='text-black' key={cat._id}>
                          <NavLink to={`/allproduct/${cat._id}`}>{cat.name}</NavLink>
                        </li>
                      ))}
                    </>
                  )}
                </ul>
              </details>
              </li>
              <li>
                <NavLink
                  to="/wishlist"
                  onClick={e => {
                    if (!userData) {
                      e.preventDefault();
                      toast.error('You need to log in first.');
                    }
                  }}
                >
                  Wishlist
                </NavLink>
              </li>
              <li><NavLink to="/contact">Contact</NavLink></li>
              {userProfile?.data?.userRole === "Admin" && (
              <li><NavLink to="/adminpage/dashboard">Admin Pannel</NavLink></li>
              )}
            </ul>
          </div>
          <Link to='/' className="w-24 "><img  src={logo} alt="logo" className="h-auto w-auto object-cover" /></Link>
        </div>

        <div className="navbar-center hidden lg:flex text-white font-semibold">
          <ul className="menu menu-horizontal px-1">
            <li><NavLink to="/">Home</NavLink></li>
            <li>
              <details>
                <summary>All Products</summary>
                <ul className="p-2 bg-gray-100 rounded-md z-10">
                  {catLoading ? (
           <LoadingPage></LoadingPage>
                  ) : (
                    <>
                      <li className='text-black'>
                        <NavLink to="/allproduct/all">All</NavLink>
                      </li>
                      {categories?.map((cat) => (
                        <li className='text-black' key={cat._id}>
                          <NavLink to={`/allproduct/${cat._id}`}>{cat.name}</NavLink>
                        </li>
                      ))}
                    </>
                  )}
                </ul>
              </details>
            </li>
            <li>
              <NavLink
                to="/wishlist"
                onClick={e => {
                  if (!userData) {
                    e.preventDefault();
                    toast.error('You need to log in first.');
                  }
                }}
              >
                Wishlist
              </NavLink>
            </li>
            <li><NavLink to="/contact">Contact</NavLink></li>
            {userProfile?.data?.userRole === "Admin" && (
              <li><NavLink to="/adminpage/dashboard">Admin Pannel</NavLink></li>
            )}
          </ul>
        </div>

        <div className="navbar-end text-white flex gap-5 text-xl items-center">
          <button
            className='block'
            onClick={e => {
              if (!userData) {
                e.preventDefault();
                toast.error('You need to log in first.');
              } else {
              
                     navigate("/wishlist")
              }
            }}
          >
            <i className="fa-solid fa-heart"></i>
          </button>
          <button
            className='block'
            onClick={e => {
              if (!userData) {
                e.preventDefault();
                toast.error('You need to log in first.');
              } else {
               
                navigate("/addtocart")
              }
            }}
          >
            <i className="fa-solid fa-cart-shopping"></i>
          </button>
          {userData ?
            <button onClick={signoutHandle} className='text-lg btn flex hover:bg-gray-300'>
              {logoutLoading ? "Logouting.." : "Logout"}
            </button> :
            <Link to="/login" className='text-lg btn flex hover:bg-gray-300'>Login</Link>}
        </div>
      </div>




     <Searchbar />

    </div>
  )
}

export default Navbar
