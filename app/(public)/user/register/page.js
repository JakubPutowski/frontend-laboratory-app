"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword, sendEmailVerification, signOut } from "firebase/auth";
import { useAuth } from "@/app/lib/AuthContext";
import { auth } from "@/app/lib/firebase";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [registerError, setRegisterError] = useState("");
  const [loading, setLoading] = useState(false);

  // Jeśli użytkownik jest już zalogowany, nie pokazuj formularza
  if (user) {
    return null;
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    setRegisterError("");
    setLoading(true);

    // Walidacja równości haseł
    if (password !== confirmPassword) {
      setRegisterError("Hasła nie są identyczne!");
      setLoading(false);
      return;
    }

    try {
      // Utworzenie użytkownika
      await createUserWithEmailAndPassword(auth, email, password);
      console.log("User registered!");

      // Wysłanie emaila weryfikacyjnego
      if (auth.currentUser) {
        await sendEmailVerification(auth.currentUser);
        console.log("Email verification send!");

        // Wylogowanie użytkownika po rejestracji
        await signOut(auth);

        // Przekierowanie do strony weryfikacji
        router.push("/user/verify");
      }
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      
      // Obsługa próby ponownej rejestracji z już zarejestrowanym adresem email
      if (errorCode === 'auth/email-already-in-use') {
        setRegisterError('Ten adres email jest już zarejestrowany. Użyj innego adresu lub zaloguj się.');
      } else if (errorCode === 'auth/invalid-email') {
        setRegisterError('Nieprawidłowy adres email.');
      } else if (errorCode === 'auth/weak-password') {
        setRegisterError('Hasło jest zbyt słabe. Użyj co najmniej 6 znaków.');
      } else {
        setRegisterError(errorMessage);
      }
      
      console.dir(error);
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-full max-w-md">
        {/* Nagłówek */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Rejestracja</h1>
          <p className="text-gray-600">Utwórz nowe konto</p>
        </div>

        {/* Formularz rejestracji - styl Tailblocks */}
        <form onSubmit={onSubmit} className="bg-white shadow-lg rounded-lg p-8">
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              placeholder="twoj@email.com"
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Hasło
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              placeholder="••••••••"
            />
            <p className="mt-1 text-xs text-gray-500">
              Minimum 6 znaków
            </p>
          </div>

          <div className="mb-6">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Potwierdź hasło
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              placeholder="••••••••"
            />
          </div>

          {/* Wyświetlanie błędów rejestracji */}
          {registerError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{registerError}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Rejestrowanie..." : "Zarejestruj się"}
          </button>

          <div className="mt-6 text-center text-sm text-gray-600">
            Masz już konto?{" "}
            <a
              href="/user/signin"
              className="text-indigo-600 hover:text-indigo-700 font-semibold"
            >
              Zaloguj się
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}

