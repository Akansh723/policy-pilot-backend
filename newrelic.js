"use strict";

exports.config = {
  app_name: [process.env.NEW_RELIC_APP_NAME || "insurance-portal-backend"],
  license_key: process.env.NEW_RELIC_LICENSE_KEY || "",
  distributed_tracing: { enabled: true },
  logging: {
    level: "trace",
    filepath: "stdout",
  },
  allow_all_headers: true,
  attributes: {
    exclude: [
      "request.headers.cookie",
      "request.headers.authorization",
      "request.headers.x-csrf-token",
    ],
  },
};
