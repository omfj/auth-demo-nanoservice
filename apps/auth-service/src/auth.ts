import { getCookie, setCookie } from "hono/cookie";
import { AppContext } from "./app";
import { verifyAccessToken } from "./jwt/access-token";

export const AUTH_COOKIE = "__auth" as const;
export const REFRESH_TOKEN_COOKIE = "__refresh_token" as const;
export const AUTHORIZATION = "Authorization" as const;

export const getAccessTokenHeader = (c: AppContext) => {
  return c.req.header(AUTHORIZATION)?.split(" ")[1];
};

export const getAccessTokenCookie = (c: AppContext) => {
  return getCookie(c, AUTH_COOKIE);
};

export const setAccessTokenCooie = (c: AppContext, token: string) => {
  setCookie(c, AUTH_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: c.env.ENV === "production",
    path: "/",
  });
};

export const deleteAccessTokenCookie = (c: AppContext) => {
  setCookie(c, AUTH_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: c.env.ENV === "production",
    path: "/",
  });
};

export const getRefreshTokenCookie = (c: AppContext) => {
  return getCookie(c, REFRESH_TOKEN_COOKIE);
};

export const setRefreshTokenCookie = (c: AppContext, token: string) => {
  setCookie(c, REFRESH_TOKEN_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: c.env.ENV === "production",
    path: "/",
  });
};

export const getAccessToken = (c: AppContext) => {
  const authHeader = getAccessTokenHeader(c);
  if (authHeader) {
    return authHeader;
  }

  const authCookie = getAccessTokenCookie(c);
  if (authCookie) {
    return authCookie;
  }

  return null;
};

export const auth = async (c: AppContext) => {
  const accessToken = getAccessToken(c);

  if (accessToken) {
    const { token } = await verifyAccessToken(c, accessToken);

    if (token) {
      return token.user;
    }
  }

  return null;
};
