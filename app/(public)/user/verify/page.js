"use client";

import { useState, useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth } from "@/app/lib/firebase";
import { useAuth } from "@/app/lib/AuthContext";
import Link from "next/link";

export default function VerifyEmail() {
  const { user } = useAuth();
  const [userEmail, setUserEmail] = useState("");

  // Zapamiętaj email użytkownika i automatycznie wyloguj przy załadowaniu strony
  useEffect(() => {
    if (user && user.email) {
      // Zapamiętaj email przed wylogowaniem
      setUserEmail(user.email);
      
      // Automatyczne wylogowanie
      signOut(auth)
        .then(() => {
          console.log("User signed out");
        })
        .catch((error) => {
          console.error("Error signing out:", error);
        });
    }
  }, [user]);

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-full max-w-md">
        {/* Nagłówek */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-indigo-100 mb-4">
            <span className="text-3xl">✉️</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Email nie zweryfikowany
          </h1>
          <p className="text-gray-600">
            Sprawdź swoją skrzynkę pocztową
          </p>
        </div>

        {/* Informacja - styl Tailblocks */}
        <div className="bg-white shadow-lg rounded-lg p-8">
          <div className="mb-6">
            <p className="text-gray-700 mb-4">
              Email nie został zweryfikowany. Zweryfikuj klikając w link w emailu wysłanym na Twój adres{" "}
              <span className="font-semibold text-indigo-600">
                {userEmail || user?.email || "twój adres email"}
              </span>.
            </p>
            <p className="text-gray-700 mb-4">
              Aby dokończyć rejestrację, kliknij w link weryfikacyjny w wiadomości email.
            </p>
            <p className="text-sm text-gray-600">
              Po weryfikacji emaila będziesz mógł się zalogować do aplikacji.
            </p>
          </div>

          <div className="space-y-3">
            <Link
              href="/user/signin"
              className="block w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-200 text-center"
            >
              Przejdź do logowania
            </Link>
            <Link
              href="/"
              className="block w-full bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition duration-200 text-center"
            >
              Wróć do strony głównej
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

