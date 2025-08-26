import React, { use } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import Swal from "sweetalert2";
import { Helmet } from "react-helmet-async";
import { FaArrowRight, FaEnvelope, FaFacebook, FaFeatherAlt, FaGithub, FaGoogle, FaHome, FaLock } from "react-icons/fa";
import { MdOutlineLogin } from "react-icons/md";
import { FcGoogle } from "react-icons/fc";
import { HiOutlineKey, HiOutlineMail } from "react-icons/hi";
import { AuthContext } from "../Context/AuthContext";

const Login = () => {

    const navigate = useNavigate();
    const { loginUser, loginWithGoogle} = use(AuthContext);
    const location = useLocation();
    const from = location.state?.from?.pathname || '/';

    const handleLogin = e =>{
      e.preventDefault();
      const form = e.target;
      const email = form.email.value;
      const password = form.password.value;


       loginUser(email, password)
      .then(() =>{
        navigate(from);
         Swal.fire({
          position: "center",
          icon: "success",
          title: "LogIn Successful",
          showConfirmButton: false,
          timer: 1500,
        });
      })
      .catch(error =>{
         Swal.fire("Error", "Google login failed", error);

      })
    }

    // login with google
     const handleGoogleLogin = () =>{
      loginWithGoogle()
      .then((result) =>{
        const loggedInUser = result.user;

        const currentUser = {
          name: loggedInUser.displayName,
          email: loggedInUser.email,
          photo: loggedInUser.photoURL,
          createdDate: new Date()
        }

        fetch('http://localhost:5000/users', {
          method: 'POST',
          headers: {"content-type": "application/json"},
          body: JSON.stringify(currentUser),
        })
        .then((res) => res.json())
        .then((data) => {
          
          if(data.insertedId || data.message === "user Already exists"){
            Swal.fire({
                position: "center",
                icon: "success",
                title: "Login with Google Successful",
                showConfirmButton: false,
                timer: 1500,
              });
              navigate(from);
          }
        })
        
    })
    .catch((error) => {
      Swal.fire("Error", "Google login failed", error);
    });
    }
    

  return (

    <div className="py-10 md:py-20 flex items-center justify-center px-4">
      <Helmet>
        <title>Staffonic | Login</title>
      </Helmet>
      <div className="w-full max-w-md bg-bas rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500">
        <div className="relative h-3 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
          <div className="absolute inset-0 bg-white opacity-10"></div>
        </div>

        <div className="p-8">
          {/* Creative Logo/Title */}
          <div className="flex flex-col items-center mb-8 group">
            <div className="relative mb-4">
              {/* logo */}
              <div className="w-16 h-16 rounded-xl flex items-center justify-center border border-gray-100 shadow-inner group-hover:rotate-6 transition-transform duration-300">
                <FaHome className="text-blue-500 text-2xl" />
              </div>
              <div className="absolute -bottom-2 -right-2 w-6 h-6 rounded-full bg-pink-100 border-2 border-white flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-blue-400"></div>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-primary mb-1">Welcome To Staffonic</h1>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1">
              <label className="text-sm font-medium text-secondary flex items-center gap-2">
                <HiOutlineMail className="text-blue-500" />
                Email Address
              </label>
              <div className="relative">
                <input
                  required
                  name="email"
                  type="email"
                  className="w-full px-4 pl-10 py-3 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition-all placeholder-gray-400"
                  placeholder="your@email.com"
                />
                <FaEnvelope className="absolute left-3 top-3.5 text-gray-400 text-sm" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-secondary flex items-center gap-2">
                <HiOutlineKey className="text-blue-500" />
                Password
              </label>
              <div className="relative">
                <input
                  required
                  name="password"
                  type="password"
                  className="w-full px-4 pl-10 py-3 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition-all placeholder-gray-400"
                  placeholder="••••••••"
                />
                <FaLock className="absolute left-3 top-3.5 text-gray-400 text-sm" />
              </div>
              <div className="flex justify-end">
                <a href="#" className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                  Forgot password? <FaArrowRight className="text-xs" />
                </a>
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium rounded-lg shadow-md transition-all duration-300 flex items-center justify-center gap-2 group"
            >
              <span>Log In</span>
              <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </form>

          {/* Creative Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 bg-base-200 text-secondary text-xs font-medium">OR</span>
            </div>
          </div>

          {/* google Login Buttons */}
          <div className="">
            <button 
              onClick={handleGoogleLogin}
              className="w-full py-3 px-4 border border-gray-200 hover:border-blue-300 rounded-lg text-secondary transition-all duration-200 flex items-center justify-center gap-2 text-sm hover:shadow-sm hover:bg-blue-50">
              <FcGoogle /> Connect with Google
            </button>
          </div>

          <p className="text-center text-sm text-gray-500 mt-8">
            Don't have an account?
            <Link to="/register" className="text-blue-600 font-medium hover:underline flex items-center justify-center gap-1">
              Create account <FaArrowRight className="text-xs" />
            </Link>
          </p>
        </div>
      </div>
    </div>



  );
};

export default Login;

