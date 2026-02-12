import { createApp } from "./app";
import { env } from "./config/env";
import { connectDB } from "./config/db";

const startServer = async () => {
  await connectDB();

  const app = createApp();
  app.listen(Number(env.port), "0.0.0.0", () => {
  console.log(`Server running on port ${env.port}`);
});
};

startServer();