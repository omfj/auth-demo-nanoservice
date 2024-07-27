import { useAuth } from "../lib/api";
import { useState } from "react";

export const Profile = () => {
  const { auth } = useAuth();
  const [username, setUsername] = useState(auth?.username ?? "");

  if (!auth) {
    throw new Error("You're not logged in");
  }

  return (
    <div className="flex flex-col gap-8">
      <h1 className="font-medium text-2xl">Profile</h1>

      <div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium" htmlFor="username">
            Username
          </label>
          <input
            id="username"
            name="username"
            readOnly
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="flex-1 border-2 rounded-lg py-1 px-3"
            type="text"
          />
        </div>
      </div>

      <div>
        <h2 className="font-medium text-xl">Sessions</h2>
      </div>
    </div>
  );
};
