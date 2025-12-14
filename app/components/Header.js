"use client";

import { useAuth } from "@/app/lib/AuthContext";
import Link from "next/link";
import { FaBars } from "react-icons/fa";

export default function Header({ onMenuToggle }) {
  const { user, loading } = useAuth();

  return (
    <header className="h-16 border-b border-gray-200 bg-white shadow-sm flex items-center">
      <div className="w-full flex items-center justify-between px-4 sm:px-6">
        <button
          className="md:hidden text-gray-500 hover:text-gray-800 transition-colors"
          onClick={onMenuToggle}
          aria-label="Otwórz menu"
        >
          <FaBars className="w-5 h-5" />
        </button>

        {loading ? (
          <div className="text-sm text-gray-400">Ładowanie...</div>
        ) : user ? (
          <>
            <div className="flex items-center gap-3">
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
                <span className="font-semibold text-indigo-600">
                  {user.email}
                </span>
              </div>
            </div>
            <div className="flex gap-4 text-sm">
              <Link
                href="/user/profile"
                className="text-gray-600 hover:text-indigo-600 transition-colors"
              >
                Profil
              </Link>
              <Link
                href="/user/signout"
                className="text-gray-600 hover:text-indigo-600 transition-colors"
              >
                Wyloguj
              </Link>
            </div>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-end gap-3 text-sm text-gray-600">
            <span className="hidden xs:inline">Nie masz konta?</span>
            <Link
              href="/user/register"
              className="font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              Zarejestruj się
            </Link>
            <span className="hidden xs:inline">|</span>
            <span className="hidden xs:inline">Masz konto?</span>
            <Link
              href="/user/signin"
              className="font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              Zaloguj się
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}

