import React, { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router";
import { FaTachometerAlt, FaEnvelope, FaBars, FaTimes, FaHome } from "react-icons/fa";
import { AuthContext } from "../Context/AuthContext";
import Swal from "sweetalert2";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen(!menuOpen);
  const { user, userData, logOut } = useContext(AuthContext);
  const navigate = useNavigate();

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
        navigate("/");
      })
      .catch(() => {});
  };

  const links = (
    <>
      <li>
        <NavLink
          to="/"
          className={({ isActive }) => 
            `flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              isActive ? "bg-blue-100 text-blue-700" : "text-white hover:bg-gray-100"
            }`
          }
        >
          <FaHome /> Home
        </NavLink>
      </li>

      {user && (
        <li className="relative group">
          <span className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-gray-700 cursor-pointer transition-colors">
            <FaTachometerAlt /> Dashboard
          </span>

          {/* ✅ Desktop (hover) */}
          {userData?.role === "employee" && (
            <ul className="absolute left-0 mt-2 w-56 bg-white shadow-lg rounded-lg p-2 space-y-1 z-50 
              invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-200 border border-gray-200 hidden md:block">
              <li>
                <NavLink
                  to="/workSheet"
                  className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors"
                >
                  Work Sheet
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/paymentHistory"
                  className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors"
                >
                  Payment History
                </NavLink>
              </li>
            </ul>
          )}

          {userData?.role === "hr" && (
            <ul className="absolute left-0 mt-2 w-56 bg-white shadow-lg rounded-lg p-2 space-y-1 z-50 
              invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-200 border border-gray-200 hidden md:block">
              <li>
                <NavLink
                  to="/employeeList"
                  className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors"
                >
                  Employee List
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/progress"
                  className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors"
                >
                  Progress
                </NavLink>
              </li>
            </ul>
          )}

          {userData?.role === "admin" && (
            <ul className="absolute left-0 mt-2 w-56 bg-white shadow-lg rounded-lg p-2 space-y-1 z-50 
              invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-200 border border-gray-200 hidden md:block">
              <li>
                <NavLink
                  to="/allEmployeeList"
                  className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors"
                >
                  All Employee List
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/payroll"
                  className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors"
                >
                  Payroll
                </NavLink>
              </li>
            </ul>
          )}

          {/*  Mobile (always visible, no hover) */}
          {userData?.role === "employee" && (
            <ul className="md:hidden mt-2 pl-6 space-y-1">
              <li>
                <NavLink
                  to="/workSheet"
                  className="block px-4 py-2 text-gray-700 rounded-md hover:bg-blue-50 hover:text-blue-600"
                >
                  Work Sheet
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/paymentHistory"
                  className="block px-4 py-2 text-gray-700 rounded-md hover:bg-blue-50 hover:text-blue-600"
                >
                  Payment History
                </NavLink>
              </li>
            </ul>
          )}

          {userData?.role === "hr" && (
            <ul className="md:hidden mt-2 pl-6 space-y-1">
              <li>
                <NavLink
                  to="/employeeList"
                  className="block px-4 py-2 text-gray-700 rounded-md hover:bg-blue-50 hover:text-blue-600"
                >
                  Employee List
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/progress"
                  className="block px-4 py-2 text-gray-700 rounded-md hover:bg-blue-50 hover:text-blue-600"
                >
                  Progress
                </NavLink>
              </li>
            </ul>
          )}

          {userData?.role === "admin" && (
            <ul className="md:hidden mt-2 pl-6 space-y-1">
              <li>
                <NavLink
                  to="/allEmployeeList"
                  className="block px-4 py-2 text-gray-700 rounded-md hover:bg-blue-50 hover:text-blue-600"
                >
                  All Employee List
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/payroll"
                  className="block px-4 py-2 text-gray-700 rounded-md hover:bg-blue-50 hover:text-blue-600"
                >
                  Payroll
                </NavLink>
              </li>
            </ul>
          )}
        </li>
      )}

      <li>
        <NavLink
          to="/contact"
          className={({ isActive }) => 
            `flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              isActive ? "bg-blue-100 text-white hover:bg-gray-100 hover:text-gray-700" : "text-gray-700 hover:text-gray-700 hover:bg-gray-100"
            }`
          }
        >
          <FaEnvelope /> Contact Us
        </NavLink>
      </li>
    </>
  );

  return (
    <nav className="backdrop-blur-md text-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-1 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <a href="/">
            <img src="/logo.png" alt="Logo" className="h-10" />
          </a>
        </div>

        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-gray-600 hover:text-blue-600 p-2 rounded-lg hover:bg-gray-100">
            {menuOpen ? <FaTimes className="text-lg" /> : <FaBars className="text-lg" />}
          </button>
        </div>

        <ul className="hidden md:flex items-center space-x-2">{links}</ul>

        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <>
              <NavLink to="/profile" className="flex items-center space-x-3 hover:bg-gray-100 rounded-lg p-2 transition-colors">
                <img
                  src={user.photoURL}
                  alt="Profile"
                  className="w-8 h-8 rounded-full border border-gray-300"
                />
              </NavLink>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Logout
              </button>
            </>
          ) : (
            <NavLink
              to="/login"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              Login
            </NavLink>
          )}
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 px-4 py-3 shadow-lg">
          {user ? (
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <img
                  src={user.photoURL}
                  alt="Profile"
                  className="w-10 h-10 rounded-full border border-gray-300"
                />
              </div>
              <button
                onClick={handleLogout}
                className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-xs"
              >
                Logout
              </button>
            </div>
          ) : (
            <NavLink
              to="/login"
              className="block w-full text-center mb-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              Login
            </NavLink>
          )}
          <ul className="space-y-2">{links}</ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
