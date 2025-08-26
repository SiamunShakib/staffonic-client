import React, { use, useState } from "react";
import { Navigate, NavLink } from "react-router";
import { FaTachometerAlt, FaEnvelope, FaBars, FaTimes } from "react-icons/fa";
import { AuthContext } from "../Context/AuthContext";
import Swal from "sweetalert2";
// import {logo} from '../../public/logo.png'

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const {user, logOut} = use(AuthContext)

  const links = <>
    <li>
      {user && (
        <NavLink to="/" className="flex items-center gap-2 text-blue-600 hover:text-blue-800" >
        <FaTachometerAlt /> Dashboard
      </NavLink>
      )}
    </li>
    <li>
      <NavLink to="/workSheet" className="flex items-center gap-2 text-white hover:text-blue-800">
         Work Sheet
      </NavLink>
    </li>
    <li>
      <NavLink to="/paymentHistory" className="flex items-center gap-2 text-white hover:text-blue-800">
         Payment H
      </NavLink>
    </li>
    <li>
      <NavLink to="/employeeList" className="flex items-center gap-2 text-white hover:text-blue-800">
         Employee L
      </NavLink>
    </li>
    <li>
      <NavLink to="/allEmployeeList" className="flex items-center gap-2 text-white hover:text-blue-800">
         A Employee L
      </NavLink>
    </li>
    <li>
      <NavLink to="/payroll" className="flex items-center gap-2 text-white hover:text-blue-800">
         Payroll
      </NavLink>
    </li>
    <li>
      <NavLink to="/contact" className="flex items-center gap-2 text-blue-600 hover:text-blue-800">
         <FaEnvelope /> Contact Us
      </NavLink>
    </li>

  </>

  // logout function
  const handleLogout = () => {
    logOut()
      .then(() => {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Logged Out Success",
          showConfirmButton: false,
          timer: 1500,
        });
        Navigate("/");
      })
      .catch(() => {});
  };

  return (
    <nav className="bg-blue-950 shadow-md px-4 py-1 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Left - Logo */}
        <div className="flex items-center space-x-2">
          <a href="/"><img src='/public/logo.png' alt="Logo" className="h-12"/></a>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-2xl text-gray-700">
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Center - Navigation Links */}
        <ul className="hidden md:flex space-x-6 text-lg">
          {links}
        </ul>

        {/* Right - Profile or Login */}
        <div className="hidden md:block">
          {user? (
            <div className="flex gap-x-4">
              <img src={user.photoURL} alt="Profile" className="w-10 h-10 rounded-full border border-gray-300" />
              <NavLink onClick={handleLogout} to="/login" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                 Logout
              </NavLink>
            </div>
            ) : (
            <NavLink to="/login" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Login
            </NavLink>
            
          )}
          
        </div>
      </div>

      {/* Mobile Menu Items */}
      {menuOpen && (
        <div className="md:hidden mt-3 space-y-2 px-4 pb-4 border-t pt-3 bg-white shadow-inner">
          {user? (
            <div className="flex items-center justify-between gap-2 pt-2"> 
              <img src={user.photoURL} alt="Profile" className="w-8 h-8 rounded-full border" />
              <span className="text-gray-700 text-sm">Profile</span>
               <NavLink onClick={handleLogout} to="/login" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                 Logout
              </NavLink>
            </div>
          ) : (
            <NavLink
              to="/login"
              className="block mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={() => setMenuOpen(false)}
            >
              Login
            </NavLink>
          )}
        <ul>
          {links}
        </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
