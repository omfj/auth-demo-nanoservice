import { createMiddleware } from "hono/factory";
import { AppContext } from "../app";
import { createDb } from "./drizzle";

export const db = () => {
  return createMiddleware(async (c: AppContext, next) => {
    const db = createDb(c.env.DB);

    c.set("db", db);

    return await next();
  });
};
