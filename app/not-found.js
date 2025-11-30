import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center max-w-md w-full px-4">
        {/* Główna zawartość - styl Tailblocks */}
        <div className="bg-white shadow-lg rounded-lg p-12">
          {/* Numer błędu */}
          <div className="mb-6">
            <h1 className="text-9xl font-bold text-indigo-600 mb-4">404</h1>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Strona nie znaleziona
            </h2>
            <p className="text-gray-600 text-lg">
              Przepraszamy, ale strona, której szukasz, nie istnieje.
            </p>
          </div>

          {/* Opis */}
          <div className="mb-8">
            <p className="text-gray-500">
              Możliwe, że adres został wpisany nieprawidłowo lub strona została
              przeniesiona.
            </p>
          </div>

          {/* Przycisk powrotu do strony domowej */}
          <Link
            href="/"
            className="inline-block bg-indigo-600 text-white py-3 px-8 rounded-lg font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-200"
          >
            Powrót do strony głównej
          </Link>
        </div>
      </div>
    </div>
  );
}

