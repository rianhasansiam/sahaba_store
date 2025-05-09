import React from 'react';
import { Link } from 'react-router-dom';

// Import the social media icons
 import bgImg from '../../assets/img/bg-img.jpg';  // Ensure these paths are correct


const Login = () => {
  return (
   
     


      <div className="login container mx-auto flex justify-center gap-20 my-10">





        {/* ===== LOGIN ACCESS ===== */}
        <div className="login__access !w-[40%]">
          <h1 className="text-2xl my-4 text-center font-semibold" >Log in to your account.</h1>

          <div className="login__area">
            <form className="login__form">
              <div className="login__content ">


                <div className="login__box bg-gray-100 ">
                  <input type="email"  required placeholder=" " className="login__input " />
                  <label htmlFor="email" className="login__label  ">Email</label>
                  <i className="ri-mail-fill login__icon"></i>
                </div>

                <div className="login__box bg-gray-100 my-8 ">
                  <input type="password"  required placeholder=" " className="login__input" />
                  <label htmlFor="password" className="login__label">Password</label>
                  <i className="ri-eye-off-fill login__icon login__password" id="loginPassword"></i>
                </div>
              </div>

              <Link to="#" className="text-right block hover:text-[#167389] hover:font-semibold underline">Forgot your password?</Link>
              <button type="submit" className="login__button ">Login</button>


              
            </form>

            <div className="login__social">
              <p className="login__social-title">Or login with</p>

              <div className="login__social-links">
                <Link to="#" className="login__social-link">
                  {/* Use the imported image paths */}
                  <img src="https://img.icons8.com/?size=100&id=17949&format=png&color=000000" alt="Google login" className="login__social-img" />
                </Link>

                {/* <Link to="#" className="login__social-link">
                  <img src={facebookIcon} alt="Facebook login" className="login__social-img" />
                </Link>

                <Link to="#" className="login__social-link">
                  <img src={appleIcon} alt="Apple login" className="login__social-img" />
                </Link> */}
              </div>
            </div>

            <p className="login__switch">
              Don't have an account? 
              <button >Create Account</button>
            </p>
          </div>
        </div>




{/* =============== LOGIN IMAGE =============== */}

       <div className=" w-[35%] rounded-r-3xl overflow-hidden ">
    
       
        <img className="h-full w-full" src={bgImg} alt="" />
 
      
    </div>




      </div>

 



  );
};

export default Login;
