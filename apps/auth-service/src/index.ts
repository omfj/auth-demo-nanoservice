import { createApp } from "./app";
import { z } from "zod";
import {
  deleteAccessTokenCookie,
  auth,
  setAccessTokenCooie,
  setRefreshTokenCookie,
} from "./auth";
import { generateAccessToken } from "./jwt/access-token";
import { generateRefreshToken } from "./jwt/refresh-token";
import { refreshTokens, users } from "./db/schema";
import { eq } from "drizzle-orm";
import { sha256 } from "./crypto/sha256";
import { nanoid } from "nanoid";

const app = createApp();

const RegisterJsonSchema = z.object({
  username: z.string(),
  password: z.string(),
});

app.post("/auth/register", async (c) => {
  const json = await c.req
    .json()
    .then((json) => RegisterJsonSchema.parse(json));

  const [existingUser] = await c.var.db
    .select()
    .from(users)
    .where(eq(users.username, json.username));

  if (existingUser) {
    return c.json({
      error: "User already exists",
    });
  }

  const hasedPassword = await sha256.hash(json.password);

  const userId = nanoid();

  await c.var.db.insert(users).values({
    id: userId,
    username: json.username,
    password: hasedPassword,
  });

  const accessToken = await generateAccessToken(c, {
    id: userId,
    username: json.username,
  });
  const refreshToken = await generateRefreshToken(c, userId);

  setAccessTokenCooie(c, accessToken);
  setRefreshTokenCookie(c, refreshToken);

  return c.json({
    success: true,
  });
});

const LoginJsonSchema = z.object({
  username: z.string(),
  password: z.string(),
});

app.post("/auth/login", async (c) => {
  const json = await c.req.json().then((json) => LoginJsonSchema.parse(json));

  const [user] = await c.var.db
    .select()
    .from(users)
    .where(eq(users.username, json.username));

  if (!user) {
    return c.json({
      error: "User not found",
    });
  }

  const passwordIsValid = await sha256.verify(json.password, user.password);

  if (!passwordIsValid) {
    return c.json({
      error: "Invalid password",
    });
  }

  const accessToken = await generateAccessToken(c, {
    id: user.id,
    username: user.username,
  });
  const refreshToken = await generateRefreshToken(c, user.id);

  setAccessTokenCooie(c, accessToken);
  setRefreshTokenCookie(c, refreshToken);

  return c.json({
    success: true,
  });
});

app.post("/auth/logout", async (c) => {
  deleteAccessTokenCookie(c);

  return c.json({
    message: "You've been logged out",
  });
});

app.get("/auth/user", async (c) => {
  const user = await auth(c);

  if (!user) {
    return c.json({ error: "You're not logged in" }, 401);
  }

  return c.json(user);
});

app.get("/auth/refresh", async (c) => {
  const user = await auth(c);

  if (!user) {
    return c.json({ error: "You're not logged in" }, 401);
  }

  return c.json({
    message: "I am not implemented yet",
  });
});

app.get("/sessions", async (c) => {
  const user = await auth(c);

  if (!user) {
    return c.json({ error: "You're not logged in" }, 401);
  }

  const sessions = await c.var.db.query.refreshTokens.findMany({
    where: eq(refreshTokens.userId, user.id),
  });

  return c.json(sessions);
});

export default app;
