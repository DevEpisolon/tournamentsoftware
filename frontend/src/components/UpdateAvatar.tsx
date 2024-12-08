import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "reactfire"; // Assuming you're using ReactFire for Firebase

const UpdateAvatar = () => {
    const [avatar, setAvatar] = useState("");
    const [message, setMessage] = useState("");
    const [displayName, setDisplayName] = useState(""); // User's display name
    const auth = useAuth();

    const handleAvatarUpdate = async () => {
        try {
            // Get Firebase ID token
            const user = await auth.currentUser;
            if (!user) {
                setMessage("User not logged in.");
                return;
            }
            const idToken = await user.getIdToken();

            // Make API request to update avatar
            const response = await axios.put(
                `http://your-backend-url/players/update_avatar/${displayName}`,
                { avatar },
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
                placeholder="Avatar URL"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
            />
            <input
                type="text"
                placeholder="Display Name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
            />
            <button onClick={handleAvatarUpdate}>Update Avatar</button>
            <p>{message}</p>
        </div>
    );
};

export default UpdateAvatar;

