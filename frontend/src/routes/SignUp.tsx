import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../utils/FirbaseConfig"; // Adjust the import if necessary
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      // Redirect or handle successful sign-up
    } catch (err) {
      setError("Failed to sign up. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#2D3250] flex items-center justify-center relative">
      {/* Home Button */}
      <button
        className="absolute top-5 left-5 bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600"
        onClick={() => navigate("/")}
      >
        Home
      </button>

      <div className="bg-[#424769] p-8 rounded-lg w-96">
        <h2 className="text-white text-3xl font-semibold mb-6">Sign Up</h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-white mb-2">Email</label>
            <input
              type="email"
              id="email"
              className="w-full p-3 rounded-lg bg-white text-black"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-white mb-2">Password</label>
            <input
              type="password"
              id="password"
              className="w-full p-3 rounded-lg bg-white text-black"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="w-full p-3 bg-[#F6B17A] text-white rounded-lg hover:bg-[#F6B17A]/80">
            Sign Up
          </button>
        </form>

        <p className="text-white text-center mt-4">
          Already have an account?{" "}
          <button
            className="text-[#F6B17A] hover:text-[#F6B17A]/80"
            onClick={() => navigate("/signin")}
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignUp;

