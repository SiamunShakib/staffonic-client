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
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
        >
          <FaHome /> Home
        </NavLink>
      </li>

      {user && (
        <li className="relative group">
          <span className="flex items-center gap-2 text-blue-600 hover:text-blue-800 cursor-pointer">
            <FaTachometerAlt /> Dashboard
          </span>

          {userData?.role === "employee" && (
            <ul className="absolute left-0 mt-2 w-56 bg-white shadow-lg rounded-md p-2 space-y-2 z-50 hidden group-hover:block">
              <li>
                <NavLink
                  to="/workSheet"
                  className="block px-3 py-2 text-gray-700 hover:bg-blue-100 rounded"
                >
                  Work Sheet
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/paymentHistory"
                  className="block px-3 py-2 text-gray-700 hover:bg-blue-100 rounded"
                >
                  Payment History
                </NavLink>
              </li>
            </ul>
          )}

          {userData?.role === "hr" && (
            <ul className="absolute left-0 mt-2 w-56 bg-white shadow-lg rounded-md p-2 space-y-2 z-50 hidden group-hover:block">
              <li>
                <NavLink
                  to="/employeeList"
                  className="block px-3 py-2 text-gray-700 hover:bg-blue-100 rounded"
                >
                  Employee List
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/progress"
                  className="block px-3 py-2 text-gray-700 hover:bg-blue-100 rounded"
                >
                  Progress
                </NavLink>
              </li>
            </ul>
          )}

          {userData?.role === "admin" && (
            <ul className="absolute left-0 mt-2 w-56 bg-white shadow-lg rounded-md p-2 space-y-2 z-50 hidden group-hover:block">
              <li>
                <NavLink
                  to="/allEmployeeList"
                  className="block px-3 py-2 text-gray-700 hover:bg-blue-100 rounded"
                >
                  All Employee List
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/payroll"
                  className="block px-3 py-2 text-gray-700 hover:bg-blue-100 rounded"
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
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
        >
          <FaEnvelope /> Contact Us
        </NavLink>
      </li>
    </>
  );

  return (
    <nav className="bg-blue-950 shadow-md px-4 py-1 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <a href="/">
            <img src="/public/logo.png" alt="Logo" className="h-12" />
          </a>
          <h2 className="text-white">{userData?.name}</h2>
          <h2 className="text-gray-300 capitalize">{userData?.role}</h2>
        </div>

        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-2xl text-gray-700">
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        <ul className="hidden md:flex space-x-6 text-lg">{links}</ul>

        <div className="hidden md:block">
          {user ? (
            <div className="flex gap-x-4">
              <NavLink to="/profile">
                <img
                  src={user.photoURL}
                  alt="Profile"
                  className="w-10 h-10 rounded-full border border-gray-300"
                />
              </NavLink>
              <NavLink
                onClick={handleLogout}
                to="/login"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Logout
              </NavLink>
            </div>
          ) : (
            <NavLink
              to="/login"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Login
            </NavLink>
          )}
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden mt-3 space-y-2 px-4 pb-4 border-t pt-3 bg-white shadow-inner">
          {user ? (
            <div className="flex items-center justify-between gap-2 pt-2">
              <img
                src={user.photoURL}
                alt="Profile"
                className="w-8 h-8 rounded-full border"
              />
              <span className="text-gray-700 text-sm">{userData?.name || user.displayName}</span>
              <NavLink
                onClick={handleLogout}
                to="/login"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
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
          <ul>{links}</ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
