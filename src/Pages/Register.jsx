import React, { useContext, useState } from "react";
import { AuthContext } from "../Context/AuthContext";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";

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
      // Firebase: create user
      const result = await createUser(email, password);
      if (!result?.user) throw new Error("User creation failed");

      // Firebase: update profile
      await updateUser({
        displayName: name,
        photoURL: imageUrl,
      });

      // MongoDB: save user to backend
      const newUser = {
        name,
        email,
        photo: imageUrl,
        role: "employee", // default role
        isVerified: false,
        fired: false,
        createdAt: new Date(),
      };

      // Check if user already exists
      const checkRes = await fetch(`http://localhost:5000/users?email=${email}`);
      const existingUsers = await checkRes.json();

      if (existingUsers.length === 0) {
        await fetch("http://localhost:5000/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newUser),
        });
      }
      // Fetch full user from backend and set to state
      const savedUserRes = await fetch(`http://localhost:5000/users?email=${email}`);
      const savedUsers = await savedUserRes.json();
      if (savedUsers.length > 0) {
        setUser(savedUsers[0]); // set user with role, name, photo, etc.
      }

      Swal.fire({
        position: "center",
        icon: "success",
        title: "Registration Successful",
        showConfirmButton: false,
        timer: 1500,
      });

      navigate("/"); // redirect after success
    } catch (err) {
      setError(err.message);
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Register</h2>
        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="text"
            name="image"
            placeholder="Profile Image URL"
            className="w-full p-2 border rounded"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
