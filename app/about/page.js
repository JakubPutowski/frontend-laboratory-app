"use client";

export default function AboutPage() {
  return (
    <div className="bg-white shadow-lg rounded-lg p-8 space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          O autorze i aplikacji
        </h1>
        <p className="text-gray-600 text-sm">
          Strona informacyjna projektu realizowanego w ramach zajęć labolatoryjnych z Frontendu.
        </p>
      </header>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-gray-900">Autor</h2>
        <p className="text-gray-700 text-sm leading-relaxed">
          Jakub Putowski, student 3 roku Informatyki Stosowanej.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-gray-900">O aplikacji</h2>
        <p className="text-gray-700 text-sm leading-relaxed">
          Aplikacja jest panelem użytkownika zbudowanym w technologii Next.js i
          Tailwind CSS, wykorzystującym Firebase do uwierzytelniania oraz
          przechowywania danych. Użytkownik może zarządzać swoim profilem,
          zapisywać adres, a także tworzyć i rozgrywać gry w kółko i krzyżyk na
          planszach o różnym rozmiarze.
        </p>
        <p className="text-gray-700 text-sm leading-relaxed">
          Projekt spełnia wymagania laboratoriów: posiada logowanie, autoryzację
          dostępu do chronionych ścieżek, zapis danych w bazie, testy E2E
          przygotowane w Playwright oraz responsywny interfejs użytkownika.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-gray-900">Technologie</h2>
        <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
          <li>Next.js (App Router)</li>
          <li>React i Context API (obsługa autentykacji)</li>
          <li>Tailwind CSS (stylowanie i responsywność)</li>
          <li>Firebase Authentication i Firestore</li>
          <li>Playwright (testy end-to-end)</li>
        </ul>
      </section>
    </div>
  );
}

