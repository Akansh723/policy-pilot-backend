try {
  require("newrelic");
  console.log(JSON.stringify({ severity: "INFO", message: "New Relic agent loaded" }));
} catch (err: any) {
  console.log(JSON.stringify({ severity: "ERROR", message: `New Relic failed to load: ${err.message}` }));
}

import { createApp } from "./app";
import { env } from "./config/env";
import { connectDB } from "./config/db";

const startServer = async () => {
  console.log(JSON.stringify({ severity: "INFO", message: `NEW_RELIC_LICENSE_KEY set: ${!!process.env.NEW_RELIC_LICENSE_KEY}` }));
  console.log(JSON.stringify({ severity: "INFO", message: `NEW_RELIC_APP_NAME: ${process.env.NEW_RELIC_APP_NAME}` }));
  console.log(JSON.stringify({ severity: "INFO", message: `NEW_RELIC_HOME: ${process.env.NEW_RELIC_HOME}` }));

  await connectDB();

  const app = createApp();
  app.listen(Number(env.port), "0.0.0.0", () => {
  console.log(`Server running on port ${env.port}`);
});
};

startServer();