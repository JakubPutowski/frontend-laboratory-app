"use client";

import { signOut } from "firebase/auth";
import { auth } from "@/app/lib/firebase";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignOutPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await signOut(auth);
      router.push("/");
    } catch (error) {
      console.error("Błąd podczas wylogowania:", error);
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-full max-w-md">
        {/* Nagłówek */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Wylogowanie</h1>
          <p className="text-gray-600">Czy na pewno chcesz się wylogować?</p>
        </div>

        {/* Formularz wylogowania - styl Tailblocks */}
        <form onSubmit={onSubmit} className="bg-white shadow-lg rounded-lg p-8">
          <div className="mb-6">
            <p className="text-gray-600 text-center">
              Po wylogowaniu zostaniesz przekierowany na stronę główną.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Wylogowywanie..." : "Wyloguj się"}
          </button>

          <div className="mt-6 text-center">
            <a
              href="/"
              className="text-sm text-gray-600 hover:text-indigo-600 transition-colors"
            >
              Anuluj i wróć do strony głównej
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}

