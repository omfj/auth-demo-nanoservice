import { z } from "zod";
import { AppContext } from "../app";
import { sign } from "hono/jwt";
import { verifyToken } from "./token";
import { nanoid } from "nanoid";
import { refreshTokens } from "../db/schema";

export const RefreshTokenPayloadSchema = z.object({
  jti: z.string(),
  sub: z.string(),
  iat: z.number(),
  exp: z.number(),
});

export type RefreshTokenPayload = z.infer<typeof RefreshTokenPayloadSchema>;

export const generateRefreshToken = async (c: AppContext, sub: string) => {
  const jti = nanoid();
  const exp = (Date.now() / 1000) * 60 * 60 * 24 * 30;
  const iat = Date.now() / 1000;

  const payload: RefreshTokenPayload = {
    jti,
    sub,
    iat,
    exp,
  };

  const name = `Session ${new Date().toISOString()}`;
  const userAgent = c.req.header("User-Agent") ?? "Unknown";

  await c.var.db.insert(refreshTokens).values({
    id: jti,
    expiresAt: exp,
    userId: sub,
    name,
    userAgent,
  });

  return await sign(payload, c.env.SIGNING_KEY);
};

export const verifyRefreshToken = async (c: AppContext, jwt: string) => {
  return await verifyToken<RefreshTokenPayload>(c, jwt);
};
