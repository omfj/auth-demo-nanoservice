import { useState } from "react";
import { authService } from "../lib/api";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

export const Login = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    const response = await authService
      .post("auth/login", {
        json: {
          username,
          password,
        },
        throwHttpErrors: false,
      })
      .json<
        | { success: true }
        | {
            error: string;
          }
      >();

    if ("error" in response) {
      setError(response.error);
      return;
    }

    queryClient.invalidateQueries({
      queryKey: ["auth"],
    });

    setError("");
    navigate("/");
  };

  return (
    <>
      <h1 className="text-xl font-medium">Login</h1>

      {error && <p className="text-red-500 py-2">{error}</p>}

      <div className="flex flex-col gap-3 max-w-[500px]">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium" htmlFor="username">
            Username
          </label>
          <input
            id="username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="flex-1 border-2 rounded-lg py-1 px-3"
            type="text"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="flex-1 border-2 rounded-lg py-1 px-3"
            type="password"
          />
        </div>

        <button
          className="px-2 py-1 rounded-md bg-blue-500 text-white"
          onClick={handleLogin}
        >
          Login
        </button>
      </div>
    </>
  );
};
