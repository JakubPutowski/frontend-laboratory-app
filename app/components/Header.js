"use client";

import { useAuth } from "@/app/lib/AuthContext";
import Link from "next/link";

export default function Header() {
  const { user, loading } = useAuth();

  return (
    <header className="h-16 border-b border-gray-200 bg-white shadow-sm">
      <div className="h-full flex items-center justify-between px-6">
        {loading ? (
          <div className="text-sm text-gray-400">Ładowanie...</div>
        ) : user ? (
          <>
            <div className="flex items-center gap-3">
              {/* Warunkowe renderowanie zdjęcia profilowego */}
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt="Zdjęcie profilowe"
                  className="w-10 h-10 rounded-full object-cover border-2 border-indigo-200"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                  <span className="text-indigo-600 font-semibold text-sm">
                    {user.email ? user.email.charAt(0).toUpperCase() : "U"}
                  </span>
                </div>
              )}
              <div className="text-sm text-gray-600">
                Zalogowany jako:{" "}
                <span className="font-semibold text-indigo-600">{user.email}</span>
              </div>
            </div>
            <div className="flex gap-4">
              <Link
                href="/user/profile"
                className="text-sm text-gray-600 hover:text-indigo-600 transition-colors"
              >
                Profil
              </Link>
              <Link
                href="/user/signout"
                className="text-sm text-gray-600 hover:text-indigo-600 transition-colors"
              >
                Wyloguj
              </Link>
            </div>
          </>
        ) : (
          <>
            <div className="text-sm text-gray-600">
              Nie masz konta?{" "}
              <Link
                href="/user/register"
                className="font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                Zarejestruj się
              </Link>
            </div>
            <div className="text-sm text-gray-600">
              Masz już konto?{" "}
              <Link
                href="/user/signin"
                className="font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                Zaloguj się
              </Link>
            </div>
          </>
        )}
      </div>
    </header>
  );
}

