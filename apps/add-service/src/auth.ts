import { getCookie } from "hono/cookie";
import { AppContext } from "./app";
import ky from "ky";

export const auth = async (c: AppContext) => {
  const authHeader = getCookie(c, "__auth");

  if (!authHeader) {
    return null;
  }

  return await ky
    .get("http://localhost:8002/auth/user", {
      headers: {
        Authorization: `Bearer ${authHeader}`,
      },
    })
    .json<{
      id: string;
      username: string;
    }>()
    .catch(() => null);
};
