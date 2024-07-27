import { Hono, Context } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { Database } from "./db/drizzle";
import { db } from "./db/middleware";

export type Bindings = {
  DB: D1Database;
};

export type Variables = {
  db: Database;
};

export type AppContext = Context<{
  Bindings: Bindings;
  Variables: Variables;
}>;

export const createApp = () => {
  const app = new Hono<{
    Bindings: Bindings;
    Variables: Variables;
  }>();

  app.use(logger());
  app.use(
    cors({
      origin: ["http://localhost:5173"],
      credentials: true,
    })
  );
  app.use(db());

  app.get("/info", (c) => {
    return c.text("Add Service");
  });

  return app;
};
