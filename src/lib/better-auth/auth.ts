import { Logger } from "@nestjs/common";

import { betterAuth } from "better-auth";
import { mikroOrmAdapter } from "better-auth-mikro-orm";
import { openAPI, bearer, admin, username } from "better-auth/plugins";

import { ormSync } from "@/db/orm";
import { config } from "@/common/config";

import { FIVE_MIN_AS_SECONDS } from "@/types";

export const auth = betterAuth({
  appName: "app-name",
  baseURL: config.app.apiUrl,
  trustedOrigins: [config.app.clientUrl],
  secret: config.secret.betterAuth,
  database: mikroOrmAdapter(ormSync),
  logger: new Logger("BettterAuth"),
  session: {
    cookieCache: {
      enabled: true,
      maxAge: FIVE_MIN_AS_SECONDS,
    },
  },
  rateLimit: {
    enabled: true,
    storage: "secondary-storage",
  },
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    bearer(),
    username({
      usernameValidator: (user) => user != "admin",
    }),
    admin(),
    openAPI(),
  ],
  advanced: {
    disableCSRFCheck: false,
    database: {
      generateId: false,
    },
  },
  hooks: {}, // used w/ @thallesp/nestjs-better-auth
});
