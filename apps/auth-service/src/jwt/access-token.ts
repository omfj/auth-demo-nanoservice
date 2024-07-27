import { AppContext } from "../app";
import { z } from "zod";
import { addMinutes, millisecondsToMinutes } from "date-fns";
import { generateToken, verifyToken } from "./token";

export const AccessTokenPayloadSchema = z.object({
  sub: z.string(),
  iat: z.number(),
  exp: z.number(),
  user: z.object({
    id: z.string(),
    username: z.string(),
  }),
});

export type AccessTokenPayload = z.infer<typeof AccessTokenPayloadSchema>;

export type AccessTokenUser = AccessTokenPayload["user"];

export const generateAccessToken = async (
  c: AppContext,
  user: AccessTokenUser
) => {
  const payload: AccessTokenPayload = {
    sub: user.id,
    iat: millisecondsToMinutes(Date.now()),
    exp: millisecondsToMinutes(addMinutes(new Date(), 15).getMilliseconds()),
    user,
  };

  return await generateToken(c, payload);
};

export const verifyAccessToken = async (c: AppContext, jwt: string) => {
  return await verifyToken<AccessTokenPayload>(c, jwt);
};
