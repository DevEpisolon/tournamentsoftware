import React, { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../utils/FirbaseConfig"; // Adjust the import if necessary
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Import axios

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Create user with Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName,
        });
      }

      // Now, call your FastAPI backend to register the player
      const playerData = {
        playername: displayName,  // Assuming you want to use display name as player name
        displayname: displayName,
        email,
      };

      // Send POST request to backend
      const response = await axios.post("http://localhost:8000/api/players/register_player", playerData, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${userCredential.user.accessToken}`, // Pass Firebase token for validation if needed
        },
      });

      console.log(response.data); // You can handle the response from your backend here

      // Redirect to home page on successful sign-up
      navigate("/");

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
          <div className="mb-4">
            <label htmlFor="displayName" className="block text-white mb-2">Display Name</label>
            <input
              type="text"
              id="displayName"
              className="w-full p-3 rounded-lg bg-white text-black"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
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

