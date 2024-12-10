// src/components/UpdateAvatar.tsx

import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../utils/AuthContext";

const UpdateAvatar = () => {
    const [avatar, setAvatar] = useState("");
    const [message, setMessage] = useState("");
    const [displayName, setDisplayName] = useState(""); // User's display name
    const { currentUser, auth } = useAuth();

    const handleAvatarUpdate = async () => {
        try {
            if (!currentUser) {
                setMessage("User not logged in.");
                return;
            }

            // Get Firebase ID token
            const idToken = await currentUser.getIdToken();

            // Make API request to update avatar
            const response = await axios.post(
                "http://your-backend-url/players/updateAvatar",
                { displayname: displayName, avatar },
                {
                    headers: {
                        Authorization: `Bearer ${idToken}`, // Pass the Firebase token
                    },
                }
            );

            setMessage(response.data.message);
        } catch (error: any) {
            console.error(error);
            setMessage(
                error.response?.data?.detail || "An error occurred while updating."
            );
        }
    };

    return (
        <div className="update-avatar">
            <h1>Update Avatar</h1>
            <input
                type="text"
                placeholder="Display Name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
            />
            <input
                type="text"
                placeholder="Avatar URL"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
            />
            <button onClick={handleAvatarUpdate}>Update Avatar</button>
            <p>{message}</p>
        </div>
    );
};

export default UpdateAvatar;

