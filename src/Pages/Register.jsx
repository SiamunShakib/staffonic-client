import React, {  useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import Swal from "sweetalert2";
import { Helmet } from "react-helmet-async";
import { FaUser, FaEnvelope, FaImage, FaLock, FaArrowRight, FaGoogle } from 'react-icons/fa';
import { HiOutlineUser, HiOutlineMail, HiOutlinePhotograph, HiOutlineKey } from 'react-icons/hi';
import { FcGoogle } from "react-icons/fc";
import { AuthContext } from "../Context/AuthContext";

const Register = () => {
  const { createUser , loginWithGoogle, updateUser, setUser} = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const handleCreateUser = (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const {email,  password, ...rest } = Object.fromEntries(formData.entries());

    const currentUser = {
      email, 
      ...rest,
      createdData: new Date(),
      verified: false};

    createUser(email, password)
      .then(() => {
        updateUser({
          displayName: formData.get('name'), 
          photoURL: formData.get('photo')
        })
        .then(() => {
          // save profile info into DB
          fetch("http://localhost:5000/users", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(currentUser),
          })
          .then((res) => res.json())
          .then((data) => {
            if (data.insertedId) {
              setUser({currentUser});
              Swal.fire({
                position: "top-center",
                icon: "success",
                title: "Your account is created",
                showConfirmButton: false,
                timer: 1500,
              });
              navigate(from, {replace: true});
            }
          });
        })
        .catch((error) => {
          Swal.fire("Error", "Google login failed", error);
        });
      })
      .catch((error) => {
        if(error.code === 'auth/email-already-in-use'){
          Swal.fire('Error', "This email is already in use.");
        }
        else{
          Swal.fire("Error", error.message || 'Account creation failed')
        }
      });
  };

  // login with google
  const handleGoogleLogin = () =>{
    const role = document.querySelector('select[name="role"]')?.value;
    const bankAccountNo = document.querySelector('input[name="bank_account_no"]')?.value;
    const salary = document.querySelector('input[name="salary"]')?.value;
    const designation = document.querySelector('select[name="designation"]')?.value;

    // check required fields for google login
    if(!role){
      Swal.fire('Role Required','Please select a role before continuing with Google','warning');
      return;
    }
    if(!bankAccountNo){
      Swal.fire('Bank Account No Required','Please enter bank account number before continuing with Google','warning');
      return;
    }
    if(!salary){
      Swal.fire('Salary Required','Please enter salary before continuing with Google','warning');
      return;
    }
    if(!designation){
      Swal.fire('Designation Required','Please select designation before continuing with Google','warning');
      return;
    }

    loginWithGoogle()
    .then((result) =>{
      const loggedInUser = result.user;

      const currentUser = {
        name: loggedInUser.displayName,
        email: loggedInUser.email,
        photo: loggedInUser.photoURL,
        role: role,
        bank_account_no: bankAccountNo,
        salary: salary,
        designation: designation,
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
          navigate(from, {replace: true});
        }
      })
    })
    .catch((error) => {
      Swal.fire("Error", "Google login failed", error);
      return;
    });
  }

  return (
    <div className=" py-10 md:py-20 flex items-center justify-center px-4 font-sans">
      <Helmet>
        <title>Staffonic | Register</title>
      </Helmet>
      <div className="w-full max-w-md bg-base-200 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500">
        <div className="relative h-3 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
          <div className="absolute inset-0 bg-white opacity-10"></div>
        </div>

        <div className="p-8">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8 group">
            <div className="relative mb-4">
              <div className="w-16 h-16 rounded-xl flex items-center justify-center border border-gray-100 shadow-inner group-hover:rotate-6 transition-transform duration-300">
                <FaUser className="text-blue-500 text-2xl" />
              </div>
              <div className="absolute -bottom-2 -right-2 w-6 h-6 rounded-full bg-pink-100 border-2 border-white flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-pink-400"></div>
              </div>
            </div>
            <h1 className="text-3xl font-semibold text-primary mb-1">Register Account</h1>
          </div>

          {/* Form */}
          <form onSubmit={handleCreateUser} className="space-y-4">
            {/* grid container for 2 col on md+ */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-primary/50 flex items-center gap-2">
                  <HiOutlineUser className="text-blue-500" />
                  Full Name
                </label>
                <div className="relative">
                  <input
                    required
                    name="name"
                    type="text"
                    className="w-full px-4 pl-10 py-3 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition-all placeholder-gray-400"
                    placeholder="Your full name"
                  />
                  <FaUser className="absolute left-3 top-3.5 text-gray-400 text-sm" />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-primary/50 flex items-center gap-2">
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

              {/* Photo URL */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-primary/50 flex items-center gap-2">
                  <HiOutlinePhotograph className="text-blue-500" />
                  Photo URL
                </label>
                <div className="relative">
                  <input
                    required
                    name="photo"
                    type="text"
                    className="w-full px-4 pl-10 py-3 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition-all placeholder-gray-400"
                    placeholder="https://example.com/photo.jpg"
                  />
                  <FaImage className="absolute left-3 top-3.5 text-gray-400 text-sm" />
                </div>
              </div>

              {/* Bank Account No */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-primary/50 flex items-center gap-2">
                  Bank Account No
                </label>
                <div className="relative">
                  <input
                    required
                    name="bank_account_no"
                    type="text"
                    className="w-full px-4 py-3 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition-all placeholder-gray-400"
                    placeholder="Enter bank account number"
                  />
                </div>
              </div>

              {/* Role */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-primary/50 flex items-center gap-2">
                  <HiOutlineUser className="text-blue-500" />
                  Select Role
                </label>
                <div className="relative">
                  <select
                    required
                    name="role"
                    className="w-full px-4 py-3 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition-all placeholder-gray-400"
                  >
                    <option value="">Choose role</option>
                    <option value="employee">Employee</option>
                    <option value="hr">HR</option>
                  </select>
                </div>
              </div>

              {/* Salary */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-primary/50 flex items-center gap-2">
                  Salary
                </label>
                <div className="relative">
                  <input
                    required
                    name="salary"
                    type="number"
                    min="0"
                    className="w-full px-4 py-3 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition-all placeholder-gray-400"
                    placeholder="Enter your salary"
                  />
                </div>
              </div>

              {/* Designation */}
              <div className="space-y-1 md:col-span-2">
                <label className="text-sm font-medium text-primary/50 flex items-center gap-2">
                  Designation
                </label>
                <div className="relative">
                  <select
                    required
                    name="designation"
                    className="w-full px-4 py-3 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition-all placeholder-gray-400"
                  >
                    <option value="">Choose designation</option>
                    <option value="sales_assistant">Sales Assistant</option>
                    <option value="social_media_executive">Social Media Executive</option>
                    <option value="digital_marketer">Digital Marketer</option>
                  </select>
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1 md:col-span-2">
                <label className="text-sm font-medium text-primary/50 flex items-center gap-2">
                  <HiOutlineKey className="text-blue-500" />
                  Password
                </label>
                <div className="relative">
                  <input
                    required
                    name="password"
                    type="password"
                    minLength="6"
                    pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}"
                    title="Must contain at least one number, one lowercase and one uppercase letter, and at least 6 characters"
                    className="w-full px-4 pl-10 py-3 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition-all placeholder-gray-400 peer"
                    placeholder="••••••••"
                  />
                  <FaLock className="absolute left-3 top-3.5 text-gray-400 text-sm" />
                </div>
                <div className="text-xs text-gray-500 mt-1 peer-focus:block hidden peer-invalid:block">
                  Must be at least 6 characters with:
                  <ul className="list-disc list-inside">
                    <li>One number</li>
                    <li>One lowercase letter</li>
                    <li>One special letter</li>
                  </ul>
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium rounded-lg shadow-md transition-all duration-300 flex items-center justify-center gap-2 group mt-6"
            >
              <span>Create Account</span>
              <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 bg-base-200 text-gray-400 text-xs font-medium">OR</span>
            </div>
          </div>

          {/* Google Signup Button */}
          <button 
            onClick={handleGoogleLogin}
            className="w-full py-2.5 px-4 border border-gray-200 hover:border-blue-300 rounded-lg text-primary transition-all duration-200 flex items-center justify-center gap-2 text-sm hover:shadow-sm hover:bg-blue-50"
          >
            <FcGoogle className="text-red-500" />
            Continue with Google
          </button>

          <p className="text-center text-sm text-primary/50 mt-8">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 font-medium hover:underline flex items-center justify-center gap-1">
              Login now <FaArrowRight className="text-xs" />
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
