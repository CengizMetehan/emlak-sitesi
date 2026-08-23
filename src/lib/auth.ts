import { betterAuth } from "better-auth";
import { magicLink } from "better-auth/plugins";
import { Resend } from "resend";
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

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export const auth = betterAuth({
  database: pool,

  baseURL: process.env.BETTER_AUTH_URL || "https://www.bilalbasol.com",

  trustedOrigins: ["https://bilalbasol.com", "https://www.bilalbasol.com"],

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
        const normalizedEmail = email.toLowerCase();

        if (!ADMIN_EMAILS.includes(normalizedEmail)) {
          throw new Error("Bu e-posta adresinin admin erişim yetkisi yok.");
        }

        if (!process.env.RESEND_API_KEY) {
          throw new Error("RESEND_API_KEY tanımlı değil.");
        }

        if (!resend) {
          throw new Error("RESEND_API_KEY tanımlı değil.");
        }

        const { error } = await resend.emails.send({
          from: "Bilal Başol <giris@bilalbasol.com>",
          to: normalizedEmail,
          subject: "Bilal Başol Yönetim Paneli Giriş Bağlantısı",
          html: `
    <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px; color: #111827;">
      <h2 style="margin-bottom: 16px;">
        Yönetim Paneli Girişi
      </h2>

      <p style="font-size: 16px; line-height: 1.6; color: #4b5563;">
        Bilal Başol Gayrimenkul yönetim paneline giriş yapmak için
        aşağıdaki butona tıklayın.
      </p>

      <div style="margin: 32px 0;">
        <a
          href="${url}"
          style="
            display: inline-block;
            background: #111827;
            color: #ffffff;
            padding: 14px 24px;
            border-radius: 10px;
            text-decoration: none;
            font-weight: 700;
          "
        >
          Yönetim Paneline Giriş Yap
        </a>
      </div>

      <p style="font-size: 13px; line-height: 1.6; color: #6b7280;">
        Bu giriş bağlantısını siz talep etmediyseniz bu e-postayı
        dikkate almayabilirsiniz.
      </p>

      <p style="font-size: 12px; color: #9ca3af; margin-top: 28px;">
        Bilal Başol Gayrimenkul Danışmanlığı
      </p>
    </div>
  `,
        });

        if (error) {
          console.error("Resend e-posta hatası:", error);
          throw new Error("Admin giriş e-postası gönderilemedi.");
        }
      },
    }),
  ],
});
