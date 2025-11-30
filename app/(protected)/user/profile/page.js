"use client";

import { useState, useEffect } from "react";
import { updateProfile } from "firebase/auth";
import { useAuth } from "@/app/lib/AuthContext";

export default function ProfilePage() {
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Wczytanie aktualnych danych użytkownika
  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || "");
      setPhotoURL(user.photoURL || "");
    }
  }, [user]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    if (!user) {
      setError("Użytkownik nie jest zalogowany.");
      setLoading(false);
      return;
    }

    try {
      await updateProfile(user, {
        displayName: displayName,
        photoURL: photoURL,
      });
      console.log("Profile updated");
      setSuccess(true);
      setLoading(false);
      
      // Ukryj komunikat sukcesu po 3 sekundach
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      setError(error.message);
      console.error("Błąd aktualizacji profilu:", error);
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-600">Ładowanie danych użytkownika...</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-full max-w-md">
        {/* Nagłówek */}
        <div className="text-center mb-8">
          {/* Warunkowe renderowanie zdjęcia profilowego */}
          {user.photoURL ? (
            <div className="inline-flex items-center justify-center mb-4">
              <img
                src={user.photoURL}
                alt="Zdjęcie profilowe"
                className="w-24 h-24 rounded-full object-cover border-4 border-indigo-200 shadow-lg"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            </div>
          ) : (
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-indigo-100 mb-4">
              <span className="text-4xl">👤</span>
            </div>
          )}
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {user.displayName || "Profil użytkownika"}
          </h1>
          <p className="text-gray-600">Zarządzaj swoimi danymi</p>
        </div>

        {/* Formularz profilu - styl Tailblocks */}
        <form onSubmit={onSubmit} className="bg-white shadow-lg rounded-lg p-8">
          <div className="mb-6">
            <label
              htmlFor="displayName"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Nazwa wyświetlana
            </label>
            <input
              type="text"
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              placeholder="Twoja nazwa"
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Adres email
            </label>
            <input
              type="email"
              id="email"
              value={user.email || ""}
              readOnly
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
            />
            <p className="mt-1 text-xs text-gray-500">
              Email nie może być zmieniony
            </p>
          </div>

          <div className="mb-6">
            <label
              htmlFor="photoURL"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              URL zdjęcia profilowego
            </label>
            <input
              type="url"
              id="photoURL"
              value={photoURL}
              onChange={(e) => setPhotoURL(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              placeholder="https://example.com/photo.jpg"
            />
            {photoURL && (
              <div className="mt-3">
                <p className="text-xs text-gray-500 mb-2">Podgląd:</p>
                <img
                  src={photoURL}
                  alt="Podgląd zdjęcia"
                  className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              </div>
            )}
          </div>

          {/* Wyświetlanie błędów */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Wyświetlanie komunikatu sukcesu */}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-600">Profil został zaktualizowany pomyślnie!</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Zapisywanie..." : "Zapisz zmiany"}
          </button>
        </form>
      </div>
    </div>
  );
}

