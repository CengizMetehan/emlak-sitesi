"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";

type LoginModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) {
    return null;
  }

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
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/45 px-4 py-8 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[440px] rounded-[24px] border border-zinc-200 bg-white p-7 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* KAPAT */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full text-2xl text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-950"
          aria-label="Giriş penceresini kapat"
        >
          ×
        </button>

        {/* ÜST GÖRSEL */}
        <div className="mx-auto flex h-[110px] max-w-[220px] items-center justify-center rounded-2xl bg-blue-50">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-sm">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-10 w-10 text-blue-600"
            >
              <path d="M12 3 4.5 6v5.5c0 4.8 3.2 7.8 7.5 9.5 4.3-1.7 7.5-4.7 7.5-9.5V6L12 3Z" />
              <path d="m9 12 2 2 4-4" />
            </svg>
          </div>
        </div>

        {/* BAŞLIK */}
        <div className="mt-5 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-600">
            Güvenli Giriş
          </p>

          <h2 className="mt-2 text-2xl font-bold text-zinc-950">Giriş Yap</h2>

          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-zinc-500">
            E-posta adresinizi girin. Size şifresiz ve güvenli bir giriş
            bağlantısı gönderilecek.
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="login-email"
              className="mb-2 block text-sm font-medium text-zinc-700"
            >
              E-posta
            </label>

            <input
              id="login-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ornek@gmail.com"
              className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-blue-500 focus:bg-white"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-blue-600 px-4 py-3.5 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Gönderiliyor..." : "Giriş Bağlantısı Gönder"}
          </button>
        </form>

        {message && (
          <div className="mt-4 rounded-xl bg-blue-50 px-4 py-3 text-sm leading-6 text-blue-700">
            {message}
          </div>
        )}

        <p className="mt-5 text-center text-xs leading-5 text-zinc-400">
          Şifre oluşturmanıza veya hatırlamanıza gerek yok.
        </p>
      </div>
    </div>
  );
}
