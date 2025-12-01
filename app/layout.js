import "./globals.css";
import { 
  FaSignInAlt, 
  FaUserPlus, 
  FaUser, 
  FaLock, 
  FaSignOutAlt,
  FaGamepad,
} from "react-icons/fa";
import { AuthProvider } from "@/app/lib/AuthContext";
import Header from "@/app/components/Header";

export const metadata = {
  title: "Frontend Laboratory App",
  description: "Lab app with Tailblocks & Firebase",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pl">
      <body className="min-h-screen bg-gray-100">
        <AuthProvider>
        <div className="flex min-h-screen">
            {/* Sidebar Navigation - inspirowany komponentami Tailblocks */}
            <aside className="w-64 bg-gray-900 text-white flex flex-col shadow-xl">
              {/* Logo/Header w sidebarze */}
              <div className="px-6 py-5 border-b border-gray-800">
              <div className="text-xl font-bold tracking-tight">
                Frontend<span className="text-indigo-400">Lab</span>
              </div>
                <p className="mt-1 text-xs text-gray-400">Panel użytkownika</p>
            </div>

              {/* Menu nawigacyjne z ikonami */}
              <nav className="flex-1 px-4 py-4 space-y-1 text-sm overflow-y-auto">
                {/* Sekcja Publiczne */}
                <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-500">
                Publiczne
              </p>
              <a
                href="/user/signin"
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-gray-200 hover:bg-gray-800 hover:text-white transition-colors duration-200"
              >
                  <FaSignInAlt className="w-5 h-5" />
                <span>Logowanie</span>
              </a>
              <a
                href="/user/register"
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-gray-200 hover:bg-gray-800 hover:text-white transition-colors duration-200"
              >
                  <FaUserPlus className="w-5 h-5" />
                <span>Rejestracja</span>
              </a>

                {/* Sekcja Chronione */}
                <p className="px-3 pt-4 pb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-500">
                Chronione
              </p>
              <a
                href="/user/profile"
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-gray-200 hover:bg-gray-800 hover:text-white transition-colors duration-200"
              >
                  <FaUser className="w-5 h-5" />
                <span>Profil</span>
              </a>
              <a
                href="/user/changepassword"
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-gray-200 hover:bg-gray-800 hover:text-white transition-colors duration-200"
              >
                  <FaLock className="w-5 h-5" />
                <span>Zmień hasło</span>
              </a>
              <a
                href="/games"
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-gray-200 hover:bg-gray-800 hover:text-white transition-colors duration-200"
              >
                  <FaGamepad className="w-5 h-5" />
                <span>Moje gry</span>
              </a>
              <a
                href="/user/signout"
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-gray-200 hover:bg-gray-800 hover:text-white transition-colors duration-200"
              >
                  <FaSignOutAlt className="w-5 h-5" />
                <span>Wyloguj</span>
              </a>
            </nav>

            {/* Stopka w sidebarze */}
              <div className="px-4 py-3 border-t border-gray-800 text-[11px] text-gray-500">
              © 2025 Frontend Laboratory
            </div>
          </aside>

            {/* Główna część aplikacji */}
            <div className="flex flex-1 flex-col min-w-0">
              {/* Górny pasek z informacjami o użytkowniku */}
              <Header />

              {/* Główna zawartość strony */}
              <main className="flex-1 p-6 bg-gray-50 overflow-y-auto">
              <div className="mx-auto max-w-4xl">{children}</div>
            </main>

              {/* Stopka na dole aplikacji */}
              <footer className="h-14 bg-gray-900 text-gray-300 text-xs flex items-center justify-center border-t border-gray-800">
                <div className="text-center">
              Aplikacja laboratoryjna – Next.js · Tailwind CSS · Tailblocks
                </div>
            </footer>
          </div>
        </div>
        </AuthProvider>
      </body>
    </html>
  );
}
