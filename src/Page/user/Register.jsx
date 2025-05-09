import React from 'react';
import bgImg from '../../assets/img/bg-img.jpg';
import { Link } from 'react-router-dom';

const Register = () => {
  return (
    <div className="login container mx-auto flex justify-center gap-20 my-10">

      {/* =============== LOGIN IMAGE =============== */}
      <div className="w-[35%] rounded-l-3xl overflow-hidden">
        <img className="h-full w-full" src={bgImg} alt="Register background" />
      </div>

      {/* ===== REGISTER ACCESS ===== */}
      <div className="login__access !w-[40%]">
        <h1 className="text-2xl my-6 text-center font-semibold ">Create your account.</h1>

        <div className="login__area">
          <form className="login__form">
            <div className="login__content">

             <div className='flex justify-between'>
               {/* First Name */}
              <div className="login__box bg-gray-100 mb-4  w-[48%]">
                <input type="text" required placeholder=" " className="login__input" />
                <label htmlFor="firstName" className="register__label ml-4">First Name</label>
              </div>

              {/* Last Name */}
              <div className="login__box bg-gray-100 mb-4  w-[48%]">
                <input type="text" required placeholder=" " className="login__input" />
                <label htmlFor="lastName" className="register__label ml-4">Last Name</label>
              </div>
             </div>

              {/* Email */}
              <div className="login__box bg-gray-100 mb-4">
                <input type="email" required placeholder=" " className="login__input" />
                <label htmlFor="email" className="register__label ml-4">Email</label>
              </div>

              {/* Password */}
              <div className="login__box bg-gray-100 mb-4">
                <input type="password" required placeholder=" " className="login__input" />
                <label htmlFor="password" className="register__label ml-4">Password</label>
              </div>

              {/* Confirm Password */}
              <div className="login__box bg-gray-100 mb-6">
                <input type="password" required placeholder=" " className="login__input" />
                <label htmlFor="confirmPassword" className="register__label ml-4">Confirm Password</label>
              </div>

              <button type="submit" className="login__button !my-0">Register</button>
            </div>
          </form>

          {/* Social Login */}
          <div className="login__social my-6">
            <p className="text-center font-semibold">Or register with</p>
            <div className="flex justify-center mt-4">
              <Link to="" className="login__button !bg-gray-200 !py-4 !my-0">
                <img
                  src="https://img.icons8.com/?size=100&id=17949&format=png&color=000000"
                  alt="Google login"
                  className="w-10 "
                />
              </Link>
            </div>
          </div>

          <p className="text-right">
            Already have an account?
            <Link to="/login"  type="button" className="underline hover:text-[#167389] hover:font-semibold ml-1">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
