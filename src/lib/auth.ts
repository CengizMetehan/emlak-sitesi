import { betterAuth } from "better-auth";
import Database from "better-sqlite3";
import { magicLink } from "better-auth/plugins";

const ADMIN_EMAILS = ["bilalbasol35@gmail.com", "cengizmetehanbasol@gmail.com"];

export const auth = betterAuth({
  database: new Database("auth.db"),

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
