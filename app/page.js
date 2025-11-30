"use client";

import { useAuth } from "@/app/lib/AuthContext";
import Link from "next/link";

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600">Ładowanie...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {user ? (
        // Widok dla zalogowanego użytkownika - styl Tailblocks
        <div className="bg-white shadow-lg rounded-lg p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-indigo-100 mb-4">
              <span className="text-3xl">👤</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Witaj, {user.email}!
            </h1>
            <p className="text-gray-600">
              Zostałeś pomyślnie zalogowany do aplikacji.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Link
              href="/user/profile"
              className="p-6 bg-indigo-50 rounded-lg border border-indigo-200 hover:bg-indigo-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">👤</span>
                <div>
                  <h3 className="font-semibold text-gray-900">Profil</h3>
                  <p className="text-sm text-gray-600">Zobacz swoje dane</p>
                </div>
              </div>
            </Link>

            <Link
              href="/user/changepassword"
              className="p-6 bg-indigo-50 rounded-lg border border-indigo-200 hover:bg-indigo-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">🔒</span>
                <div>
                  <h3 className="font-semibold text-gray-900">Zmień hasło</h3>
                  <p className="text-sm text-gray-600">Zaktualizuj hasło</p>
                </div>
              </div>
            </Link>
          </div>

          <div className="text-center">
            <Link
              href="/user/signout"
              className="inline-block px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              Wyloguj się
            </Link>
          </div>
        </div>
      ) : (
        // Widok dla niezalogowanego użytkownika - styl Tailblocks
        <div className="bg-white shadow-lg rounded-lg p-8 text-center">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Frontend Laboratory App
            </h1>
            <p className="text-gray-600">
              Aplikacja laboratoryjna z autentykacją Firebase
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/user/signin"
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
            >
              Zaloguj się
            </Link>
            <Link
              href="/user/register"
              className="px-6 py-3 bg-white text-indigo-600 border-2 border-indigo-600 rounded-lg font-semibold hover:bg-indigo-50 transition-colors"
            >
              Zarejestruj się
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
