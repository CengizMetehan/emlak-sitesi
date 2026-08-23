import { betterAuth } from "better-auth";
import { magicLink } from "better-auth/plugins";
import pg from "pg";

const { Pool } = pg;

const ADMIN_EMAILS = ["bilalbasol35@gmail.com", "cengizmetehanbasol@gmail.com"];

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.NODE_ENV === "production"
      ? {
          rejectUnauthorized: false,
        }
      : undefined,
});

export const auth = betterAuth({
  database: pool,

  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: "ADMIN",
        input: false,
      },
    },
  },

  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const email = user.email.toLowerCase();

          if (!ADMIN_EMAILS.includes(email)) {
            throw new Error("Bu e-posta adresinin admin erişim yetkisi yok.");
          }

          return {
            data: {
              ...user,
              role: "ADMIN",
            },
          };
        },
      },
    },
  },

  plugins: [
    magicLink({
      sendMagicLink: async ({ email, url }) => {
        console.log("\n========== MAGIC LINK ==========");
        console.log("E-posta:", email);
        console.log("Giriş linki:", url);
        console.log("================================\n");
      },
    }),
  ],
});
