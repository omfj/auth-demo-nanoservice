import {
  JWTPayload,
  JwtTokenExpired,
  JwtTokenInvalid,
  JwtTokenSignatureMismatched,
} from "hono/utils/jwt/types";
import { AppContext } from "../app";
import { sign, verify } from "hono/jwt";

export const generateToken = async <T extends JWTPayload>(
  c: AppContext,
  payload: T
) => {
  return await sign(payload, c.env.SIGNING_KEY);
};

const TOKEN_INVALID = "Token invalid" as const;
const TOKEN_EXPIRED = "Token expired" as const;
const TOKEN_SIGNATURE_MISMATCHED = "Token signature mismatched" as const;
const UNKNOWN_ERROR = "Unknown error" as const;

const VERIFY_TOKEN_ERRORS = [
  TOKEN_INVALID,
  TOKEN_EXPIRED,
  TOKEN_SIGNATURE_MISMATCHED,
  UNKNOWN_ERROR,
] as const;

type VerifyTokenError = (typeof VERIFY_TOKEN_ERRORS)[number];

export type VerifyTokenReturnType<T extends JWTPayload> =
  | {
      token: T;
      error?: undefined;
    }
  | {
      token?: undefined;
      error: VerifyTokenError;
    };

export const verifyToken = async <T extends JWTPayload>(
  c: AppContext,
  jwt: string
): Promise<VerifyTokenReturnType<T>> => {
  try {
    const token = await verify(jwt, c.env.SIGNING_KEY);

    const payload = token.payload as T;

    return {
      token: {
        ...payload,
        ...token,
      },
    };
  } catch (e) {
    if (e instanceof JwtTokenInvalid) {
      return {
        error: TOKEN_INVALID,
      };
    }

    if (e instanceof JwtTokenExpired) {
      return {
        error: TOKEN_EXPIRED,
      };
    }

    if (e instanceof JwtTokenSignatureMismatched) {
      return {
        error: TOKEN_SIGNATURE_MISMATCHED,
      };
    }

    return {
      error: UNKNOWN_ERROR,
    };
  }
};
