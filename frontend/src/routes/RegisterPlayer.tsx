import React, { useRef } from "react";
import { useAuth } from "../utils/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RegisterPlayer: React.FC = () => {
  const displayRef = useRef<string>("");
  const playerRef = useRef<string>("");
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const addUserToDatabase = async () => {
    const displayName = displayRef.current;
    const playerName = playerRef.current;
    const email = currentUser!.email!;
    // Add code to send a POST request to FastAPI to add the player to the database

    try {
      const result = await axios.post(
        "http://localhost:8000/api/players/register_player",
        {
          email: email,
          displayname: displayName,
          playername: playerName,
        }
      );
      if (result.status === 200) {
        alert("Player added successfully");
        navigate(`/player/${displayName}`);
        return;
      }
      alert("Failed to add player to database.");
    } catch (error) {
      alert("Error adding player to database");
    }
  };

  return (
    <div className="p-5 flex flex-col justify-center items-center">
      <p>Please register the player</p>
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          Display Name
        </label>
        <div className="mt-2 w-[500px]">
          <input
            type="text"
            name="text"
            onChange={(e) => {
              displayRef.current = e.target.value;
            }}
            id="displayname"
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            placeholder="aadim"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          Player Name
        </label>
        <div className="mt-2 w-[500px]">
          <input
            type="text"
            name="text"
            id="playername"
            onChange={(e) => {
              playerRef.current = e.target.value;
            }}
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            placeholder="aadch"
          />
        </div>
      </div>
      <button
        type="button"
        onClick={() => addUserToDatabase()}
        className="mt-2 rounded-md bg-indigo-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
      >
        Submit
      </button>
    </div>
  );
};

export default RegisterPlayer;
