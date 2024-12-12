import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";
import { IoArrowBack } from "react-icons/io5";
import { FaSignOutAlt, FaTrash } from "react-icons/fa";
import { GiCharacter } from "react-icons/gi";
import { ImStatsDots } from "react-icons/im";
import { IoMdHome } from "react-icons/io";
import { IoChevronBack, IoChevronForward } from "react-icons/io5"; // Added icons for expanding/collapsing
import { getAuth, signOut, deleteUser, updateProfile } from "firebase/auth";
import { useAuth } from "../utils/AuthContext";
import { MdCancel, MdEdit } from "react-icons/md";
import { FaCheck } from "react-icons/fa6";
import { useDialog } from "../utils/DialogProvider.tsx";
import { toast } from "react-toastify";
import { auth } from "../utils/FirbaseConfig.tsx";
import { supabase } from "../utils/supabase.ts";

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  // State management
  const [playerData, setPlayerData] = useState<any>(null);
  const [selectedView, setSelectedView] = useState<string>("playerInfo");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState<string>("");
  const [isTaskbarExpanded, setIsTaskbarExpanded] = useState<boolean>(false);

  // Fetch player data
  useEffect(() => {
    const fetchPlayerData = async () => {
      if (!currentUser || !currentUser.uid) {
        console.error("No valid current user found.");
        return;
      }

      const url = `http://localhost:8000/api/players/settings/${currentUser.displayName}`;
      console.log("Fetching player data from:", url);

      try {
        const response = await axios.get(url);
        console.log("Player data response:", response.data);
        setPlayerData(response.data);
        setLoading(false);
      } catch (err: any) {
        setLoading(false);
        setError("Failed to load player data.");

        if (err.response) {
          console.error("Error response from server:", err.response.data);
        } else {
          console.error("Network or other error:", err.message);
        }
      }
    };

    fetchPlayerData();
  }, [currentUser]);

  // Handlers
  const handleBackToHome = () => {
    navigate("/");
  };

  const handleSignOut = async () => {
    try {
      await signOut(getAuth());
      console.log("User signed out successfully.");
      navigate("/routes/sign-in");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmation.toLowerCase() !== "delete") {
      alert("Confirmation does not match. Account not deleted.");
      return;
    }

    try {
      const deleteUrl = `http://localhost:8000/api/players/delete_player/${currentUser.displayName}`;
      await axios.delete(deleteUrl);

      if (currentUser.uid) {
        await deleteUser(currentUser);
      }

      navigate("/routes/sign-in");
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response.data.detail == `Player '${currentUser.displayName}' not found.`) {
          if (currentUser.uid) {
            await deleteUser(currentUser);
          }
        }
      }
      console.error("Error deleting account:", error);
      alert("Failed to delete account. Please try again.");
    }
  };

  const toggleTaskbar = () => {
    setIsTaskbarExpanded(!isTaskbarExpanded);
  };

  // Render sections
  const renderDeleteAccountModal = () => {
    if (!showDeleteModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg w-96 text-black">
          <h2 className="text-xl font-bold mb-4 text-red-600">Delete Account</h2>
          <p className="mb-4">
            This will permanently delete your account. This action cannot be undone.
          </p>
          <p className="mb-4">
            To confirm, type <strong>DELETE</strong> in the box below:
          </p>
          <input
            type="text"
            value={deleteConfirmation}
            onChange={(e) => setDeleteConfirmation(e.target.value)}
            className="w-full p-2 border rounded mb-4"
            placeholder="Type DELETE to confirm"
          />
          <div className="flex justify-between">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="bg-gray-300 text-black px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteAccount}
              className="bg-red-600 text-white px-4 py-2 rounded"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderPlayerInfo = () => {
    const [isEditingAboutMe, setIsEditingAboutMe] = useState(false);
    const aboutMeRef = useRef();

    const [isEditingDisplayName, setIsEditingDisplayName] = useState(false);
    const displayNameRef = useRef();

    if (loading) return <p>Loading player information...</p>;
    if (error) return (
      <div>
        <p>{error}</p>
        <button onClick={() => setShowDeleteModal(true)}>Delete Account</button>
        {renderDeleteAccountModal()}
      </div>
    );
    if (!playerData) return <p>No player data available.</p>;

    const joinDate = playerData["join date"]
      ? new Date(playerData["join date"]).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
      : "Not available";


    const updateAboutMe = async () => {
      const newAboutMe = aboutMeRef.current.value
      console.log("newAboutMe", newAboutMe.length, newAboutMe)

      if (newAboutMe.length <= 0) {
        alert("About me should have alteast one character")
        return;
      }

      try {
        const updateUrl = `http://localhost:8000/api/players/update_about_me/${currentUser.displayName}`;
        const response = await axios.put(updateUrl, {
          "aboutMe": newAboutMe
        });

        console.log(response)
        if (response.status != 200) {
          toast.error("Error trying to update about me");
        }

        window.location.reload()


      } catch (e) {
        toast.error("Error trying to update about me");
      }
    }

    const updateDisplayName = async () => {
      const newDisplayName: string = displayNameRef.current.value

      if (newDisplayName.length <= 0 || newDisplayName.length > 30) {
        alert("Display name should have at least 3-30 character")
        return;
      }



      try {
        const updateUrl = `http://localhost:8000/api/players/update_display_name/${currentUser.displayName}`;
        const response = await axios.put(updateUrl, {
          "display_name": newDisplayName
        });

        console.log(response)
        if (response.status != 200) {
          toast.error("Error trying to update display name");
        }

        const displayName = newDisplayName
        if (auth.currentUser) {
          await updateProfile(auth.currentUser, {
            displayName,
          });
        }
        window.location.reload()


      } catch (e) {
        toast.error("Error trying to update display name");
      }
    }

    const updateAvatar = async (url: string) => {

      try {
        const updateUrl = `http://localhost:8000/api/players/update_avatar/${currentUser.displayName}`;
        const response = await axios.put(updateUrl, {
          "avatar": url
        });

        console.log(response)
        if (response.status != 200) {
          toast.error("Error trying to update display name");
        }
        window.location.reload()
      } catch (e) {
        toast.error("Error trying to update display name");
      }
    }







    console.log(playerData.avatar)

    return (
      <div className="account-info space-y-6">
        <div className="flex items-center space-x-4">
          <div className="relative w-24 h-24">
            <img
              src={playerData.avatar || "/default-avatar.png"}
              alt="Profile"
              className="w-full h-full rounded-full border border-gray-300 hover:bg-gray-100"
            />
            <input
              type="file"
              accept="image/*"
              className="hidden"
              id="avatar-upload"
              onChange={async (e) => {
                if (e.target.files?.[0]) {
                  // Handle file upload here
                  console.log(e.target.files[0]);
                  const file = e.target.files[0];

                  const { data, error } = await supabase.storage.from(
                    'avatar'
                  ).upload(`${playerData.playername}/${file.name}`, file, {
                    upsert: true
                  });

                  const { data: { publicUrl } } = supabase.storage.from('avatar')
                    .getPublicUrl(`${playerData.playername}/${file.name}`)

                  await updateAvatar(publicUrl)
                }
              }}
            />
            <label
              htmlFor="avatar-upload"
              className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
            >
              <MdEdit className="text-gray-600 text-2xl bg-gray-100 bg-opacity-75 p-1 rounded-full" />
            </label>
          </div>
        </div>
        <div className="space-y-2">
          <p><strong>Player Name:</strong> {playerData.playername || "Not set"}</p>
          <p><strong>Join Date:</strong> {joinDate}</p>
          <form className="flex flex-row gap-2 items-center"
            onSubmit={(e) => {
              e.preventDefault()
              updateAboutMe()
            }}
          >
            <strong>About Me:</strong>
            {
              isEditingAboutMe ?
                <input max={25} min={1} ref={aboutMeRef} defaultValue={playerData.aboutme ?? ""}
                  className="text-black border border-2 border-blue-500 rounded-lg p-2" /> :
                <p> {playerData.aboutme || "No description provided"}</p>
            }
            {
              isEditingAboutMe ? (
                <div className={"flex flex-row gap-5"}>
                  <button type={"button"} onClick={() => setIsEditingAboutMe(false)}>
                    <MdCancel className={"size-7 hover:text-gray-400"} />
                  </button>
                  <button type={"submit"}>
                    <FaCheck className={"size-7 hover:text-gray-400"} />
                  </button>
                </div>
              ) : (
                <button type={"button"} onClick={() => setIsEditingAboutMe(!isEditingAboutMe)}>
                  <MdEdit className={"size-5 hover:text-gray-400"} />
                </button>
              )
            }
          </form>
        </div>
        <div className="pt-4">
          <button
            onClick={() => setShowDeleteModal(true)}
            className="bg-red-600 text-white px-6 py-3 rounded flex items-center space-x-2 hover:bg-red-700 transition-colors"
          >
            <FaTrash /> <span>Delete Account</span>
          </button>
        </div>
      </div>
    );
  };

  const renderPlayerStats = () => {
    if (loading) return <p>Loading player stats...</p>;
    if (error) return (
      <div>
        <p>{error}</p>

      </div>
    );
    if (!playerData) return <p>No player data available.</p>;


    return (
      <div className="player-stats space-y-6">
        <div className="space-y-2">
          <p><strong>Wins:</strong> {playerData.wins}</p>
          <p><strong>Losses:</strong> {playerData.losses}</p>
          <p><strong>Ties:</strong> {playerData.ties}</p>
          <p><strong>Win/Loss Ratio:</strong> {playerData.wlratio}</p>
          <p><strong>Tournament Wins:</strong> {playerData["tournament wins"]}</p>
          <p><strong>Tournament Losses:</strong> {playerData["tournament losses"]}</p>
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold">Match History</h3>
          <ul>
            {playerData.match_history && playerData.match_history.length > 0 ? (
              playerData.match_history.map((match: any, index: number) => (
                <li key={index}>
                  {match.date}: {match.result}
                </li>
              ))
            ) : (
              <p>No match history available</p>
            )}
          </ul>
        </div>
      </div>
    );
  };

  return (
    <div className="settings-page h-screen flex">
      <div
        className={`taskbar text-white p-6 flex flex-col items-center transition-all duration-300 ${isTaskbarExpanded ? "w-64" : "w-16"}`}
        style={{ backgroundColor: "#424769" }}
      >
        <button
          className="mb-6 text-white hover:bg-[#F6B17A] hover:text-gray-300 transition-all duration-200 w-12 h-12 flex items-center justify-center"
          onClick={toggleTaskbar}
        >
          {isTaskbarExpanded ? <IoChevronBack size={32} /> : <IoChevronForward size={32} />}
        </button>
        <button
          className={`mb-6 text-white hover:bg-[#F6B17A] hover:text-gray-300 transition-all duration-200 ${isTaskbarExpanded ? "w-full" : "w-16"} h-12 flex items-center justify-center space-x-2`}
          onClick={handleBackToHome}
        >
          <IoMdHome size={32} />
          {isTaskbarExpanded && <span className="ml-2">Home</span>}
        </button>
        <button
          className={`mb-6 text-white hover:bg-[#F6B17A] hover:text-gray-300 transition-all duration-200 ${isTaskbarExpanded ? "w-full" : "w-16"} h-12 flex items-center justify-center space-x-2`}
          onClick={() => setSelectedView("playerInfo")}
        >
          <GiCharacter size={32} />
          {isTaskbarExpanded && <span className="ml-2">Player Info</span>}
        </button>
        <button
          className={`mb-6 text-white hover:bg-[#F6B17A] hover:text-gray-300 transition-all duration-200 ${isTaskbarExpanded ? "w-full" : "w-16"} h-12 flex items-center justify-center space-x-2`}
          onClick={() => setSelectedView("playerStats")}
        >
          <ImStatsDots size={32} />
          {isTaskbarExpanded && <span className="ml-2">Player Stats</span>}
        </button>
        <button
          className={`mt-auto text-white hover:bg-[#F6B17A] hover:text-gray-300 transition-all duration-200 ${isTaskbarExpanded ? "w-full" : "w-16"} h-12 flex items-center justify-center space-x-2`}
          onClick={handleSignOut}
        >
          <FaSignOutAlt size={32} />
          {isTaskbarExpanded && <span className="ml-2">Sign Out</span>}
        </button>
      </div>
      <div className="content flex-1 p-6" style={{ backgroundColor: "#2D3250", color: "white" }}>
        <h1 className="text-2xl font-bold mb-4">Account Settings</h1>
        {selectedView === "playerInfo" && renderPlayerInfo()}
        {selectedView === "playerStats" && renderPlayerStats()}
      </div>
      {renderDeleteAccountModal()}
    </div>
  );
};

export default Settings;
