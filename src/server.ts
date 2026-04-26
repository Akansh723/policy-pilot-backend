import { createApp } from "./app";
import { env } from "./config/env";
import { connectDB } from "./config/db";

const startServer = async () => {
  console.warn("NEW_RELIC_LICENSE_KEY set:", !!process.env.NEW_RELIC_LICENSE_KEY);
  console.warn("NEW_RELIC_APP_NAME:", process.env.NEW_RELIC_APP_NAME);
  console.warn("NEW_RELIC_HOME:", process.env.NEW_RELIC_HOME);

  await connectDB();

  const app = createApp();
  app.listen(Number(env.port), "0.0.0.0", () => {
  console.log(`Server running on port ${env.port}`);
});
};

startServer();