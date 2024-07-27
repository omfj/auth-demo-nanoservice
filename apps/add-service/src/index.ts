import { createApp } from "./app";
import { addHistory } from "./db/schema";
import { nanoid } from "nanoid";
import { auth } from "./auth";
import { eq } from "drizzle-orm";

const app = createApp();

app.post("/add", async (c) => {
  const user = await auth(c);

  if (!user) {
    return c.json({ error: "You're not logged in" }, 401);
  }

  const { a, b } = await c.req.json<{
    a: number;
    b: number;
  }>();

  const result = a + b;

  const addId = nanoid();

  await c.var.db.insert(addHistory).values({
    id: addId,
    a,
    b,
    result,
    userId: user.id,
  });

  return c.json({ result });
});

app.get("/history", async (c) => {
  const user = await auth(c);

  if (!user) {
    return c.json({ error: "You're not logged in" }, 401);
  }

  const history = await c.var.db.query.addHistory.findMany({
    where: eq(addHistory.userId, user.id),
  });

  return c.json(history);
});

export default app;
