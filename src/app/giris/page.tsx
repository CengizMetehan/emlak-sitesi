"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";

export default function GirisPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    const { error } = await authClient.signIn.magicLink({
      email,
      callbackURL: "/giris/yonlendir",
    });

    if (error) {
      setMessage("Giriş bağlantısı oluşturulamadı.");
    } else {
      setMessage(
        "Giriş bağlantısı oluşturuldu. Geliştirme sırasında bağlantıyı terminalden açabilirsin.",
      );
    }

    setLoading(false);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-950 px-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-8 text-white shadow-2xl">
        <h1 className="text-3xl font-semibold">Admin Girişi</h1>

        <p className="mt-2 text-sm text-white/60">
          Yönetim paneline erişmek için yetkili admin e-posta adresinizi girin.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium">
              E-posta
            </label>

            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Admin e-posta adresi"
              className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 outline-none transition focus:border-white/30"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-white px-4 py-3 font-semibold text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Gönderiliyor..." : "Admin Giriş Bağlantısı Gönder"}
          </button>
        </form>

        {message && <p className="mt-4 text-sm text-white/70">{message}</p>}

        <a
          href="/"
          className="mt-6 flex w-full items-center justify-center rounded-xl border border-white/15 px-4 py-3 font-medium text-white/80 transition hover:bg-white/10 hover:text-white"
        >
          ← Ana Sayfaya Dön
        </a>
      </div>
    </main>
  );
}
