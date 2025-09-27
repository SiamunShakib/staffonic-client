import React, { useContext, useState } from "react";
import { AuthContext } from "../Context/AuthContext";
import { useNavigate, Link } from "react-router";
import Swal from "sweetalert2";
import { Helmet } from "react-helmet-async";
import { FaArrowRight, FaHome, FaLock, FaEnvelope } from "react-icons/fa";

const Register = () => {
  const { createUser, updateUser, setUser } = useContext(AuthContext);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value;
    const email = form.email.value;
    const password = form.password.value;
    const imageUrl = form.image.value;
    const role = form.role.value;
    const bankAccount = form.bankAccount.value;
    const salary = parseFloat(form.salary.value) || 0;
    const designation = form.designation.value;

    setError("");

    // Password validation
    const capitalLetter = /[A-Z]/.test(password);
    const specialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    if (password.length < 6 || !capitalLetter || !specialChar) {
      setError(
        "Password must be at least 6 characters, include a capital letter, and a special character."
      );
      return;
    }

    try {
      const result = await createUser(email, password);
      if (!result?.user) throw new Error("User creation failed");

      await updateUser({
        displayName: name,
        photoURL: imageUrl,
      });

      const newUser = {
        name,
        email,
        photo: imageUrl,
        role,
        designation,
        bankAccount,
        salary,
        isVerified: false,
        fired: false,
        createdAt: new Date(),
      };

      const checkRes = await fetch(`http://localhost:5000/users?email=${email}`);
      const existingUsers = await checkRes.json();

      if (existingUsers.length === 0) {
        await fetch("http://localhost:5000/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newUser),
        });
      }

      const savedUserRes = await fetch(`http://localhost:5000/users?email=${email}`);
      const savedUsers = await savedUserRes.json();
      if (savedUsers.length > 0) {
        setUser(savedUsers[0]);
      }

      Swal.fire({
        position: "center",
        icon: "success",
        title: "Registration Successful",
        showConfirmButton: false,
        timer: 1500,
      });

      navigate("/");
    } catch (err) {
      setError(err.message);
      console.error(err);
    }
  };

  return (
    <div className="py-10 md:py-20 flex items-center justify-center px-4">
      <Helmet>
        <title>Staffonic | Register</title>
      </Helmet>
      <div className="w-full max-w-md bg-bas rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500">
        <div className="relative h-3 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
          <div className="absolute inset-0 bg-white opacity-10"></div>
        </div>

        <div className="p-8">
          <div className="flex flex-col items-center mb-8 group">
            <div className="relative mb-4">
              <div className="w-16 h-16 rounded-xl flex items-center justify-center border border-gray-100 shadow-inner group-hover:rotate-6 transition-transform duration-300">
                <FaHome className="text-blue-500 text-2xl" />
              </div>
              <div className="absolute -bottom-2 -right-2 w-6 h-6 rounded-full bg-pink-100 border-2 border-white flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-blue-400"></div>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-primary mb-1">Register to Staffonic</h1>
          </div>

          {/* Register Form */}
          <form onSubmit={handleRegister} className="space-y-5">
            <div className="relative">
              <label className="block mb-1 text-sm font-medium text-gray-600">Full Name</label>
              <input
                required
                name="name"
                type="text"
                className="w-full px-4 pl-10 py-3 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition-all placeholder-gray-400"
                placeholder="Full Name"
              />
              <FaHome className="absolute left-3 top-10 text-gray-400 text-sm" />
            </div>

            <div className="relative">
              <label className="block mb-1 text-sm font-medium text-gray-600">Email Address</label>
              <input
                required
                name="email"
                type="email"
                className="w-full px-4 pl-10 py-3 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition-all placeholder-gray-400"
                placeholder="Email Address"
              />
              <FaEnvelope className="absolute left-3 top-10 text-gray-400 text-sm" />
            </div>

            <div className="relative">
              <label className="block mb-1 text-sm font-medium text-gray-600">Password</label>
              <input
                required
                name="password"
                type="password"
                className="w-full px-4 pl-10 py-3 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition-all placeholder-gray-400"
                placeholder="Password"
              />
              <FaLock className="absolute left-3 top-10 text-gray-400 text-sm" />
            </div>

            <div className="relative">
              <label className="block mb-1 text-sm font-medium text-gray-600">Profile Image URL</label>
              <input
                required
                name="image"
                type="text"
                className="w-full px-4 pl-10 py-3 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition-all placeholder-gray-400"
                placeholder="Profile Image URL"
              />
              <FaHome className="absolute left-3 top-10 text-gray-400 text-sm" />
            </div>

            <div className="relative">
              <label className="block mb-1 text-sm font-medium text-gray-600">Select your Role</label>
              <select
                name="role"
                required
                className="w-full px-4 py-3 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition-all"
                defaultValue="employee"
              >
                <option value="employee">Employee</option>
                <option value="hr">HR</option>
              </select>
            </div>

            <div className="relative">
              <label className="block mb-1 text-sm font-medium text-gray-600">Bank Account Number</label>
              <input
                required
                name="bankAccount"
                type="text"
                className="w-full px-4 py-3 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition-all placeholder-gray-400"
                placeholder="Bank Account Number"
              />
            </div>

            <div className="relative">
              <label className="block mb-1 text-sm font-medium text-gray-600">Salary</label>
              <input
                required
                name="salary"
                type="number"
                className="w-full px-4 py-3 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition-all placeholder-gray-400"
                placeholder="Salary"
              />
            </div>

            <div className="relative">
              <label className="block mb-1 text-sm font-medium text-gray-600">Designation</label>
              <select
                required
                name="designation"
                className="w-full px-4 py-3 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition-all"
                defaultValue="sales assistant"
              >
                <option value="sales assistant">Sales Assistant</option>
                <option value="social media executive">Social Media Executive</option>
                <option value="digital marketer">Digital Marketer</option>
              </select>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium rounded-lg shadow-md transition-all duration-300 flex items-center justify-center gap-2 group"
            >
              <span>Register</span>
              <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-8">
            Already have an account?
            <Link
              to="/login"
              className="text-blue-600 font-medium hover:underline flex items-center justify-center gap-1"
            >
              Log in <FaArrowRight className="text-xs" />
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
