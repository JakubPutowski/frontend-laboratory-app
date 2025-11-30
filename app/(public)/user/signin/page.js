"use client";

import { useState } from "react";
import { signInWithEmailAndPassword, setPersistence, browserSessionPersistence, signOut } from 'firebase/auth';
import { auth } from '@/app/lib/firebase';
import { useSearchParams, useRouter } from "next/navigation";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const params = useSearchParams();
  const router = useRouter();
  const returnUrl = params.get("returnUrl");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Ustawienie persystencji sesji
      await setPersistence(auth, browserSessionPersistence);
      
      // Logowanie użytkownika
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Sprawdzenie czy email jest zweryfikowany
      if (!user.emailVerified) {
        // Jeśli email nie jest zweryfikowany, wyloguj i przekieruj do strony weryfikacji
        await signOut(auth);
        router.push("/user/verify");
        return;
      }
      
      // Przekierowanie po udanym logowaniu (tylko jeśli email jest zweryfikowany)
      if (returnUrl) {
        router.push(returnUrl);
      } else {
        router.push("/");
      }
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      
      // Obsługa błędów i wyświetlanie użytkownikowi w formularzu
      if (errorCode === 'auth/invalid-email') {
        setError('Nieprawidłowy adres email.');
      } else if (errorCode === 'auth/user-disabled') {
        setError('Konto użytkownika zostało wyłączone.');
      } else if (errorCode === 'auth/user-not-found') {
        setError('Nie znaleziono użytkownika o podanym adresie email.');
      } else if (errorCode === 'auth/wrong-password') {
        setError('Nieprawidłowe hasło.');
      } else if (errorCode === 'auth/invalid-credential') {
        setError('Nieprawidłowy email lub hasło.');
      } else {
        setError('Wystąpił błąd podczas logowania. Spróbuj ponownie.');
      }
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-full max-w-md">
        {/* Nagłówek */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Logowanie</h1>
          <p className="text-gray-600">Zaloguj się do swojego konta</p>
        </div>

        {/* Formularz logowania - styl Tailblocks */}
        <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-8">
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              placeholder="••••••••"
            />
          </div>

          {/* Wyświetlanie błędów */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="mb-6">
            <a
              href="#"
              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Zapomniałeś hasła?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Logowanie..." : "Zaloguj się"}
          </button>

          <div className="mt-6 text-center text-sm text-gray-600">
            Nie masz konta?{" "}
            <a
              href="/user/register"
              className="text-indigo-600 hover:text-indigo-700 font-semibold"
            >
              Zarejestruj się
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}

