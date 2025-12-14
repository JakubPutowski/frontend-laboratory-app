"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FaSignInAlt,
  FaUserPlus,
  FaUser,
  FaSignOutAlt,
  FaGamepad,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import Header from "@/app/components/Header";
import { useAuth } from "@/app/lib/AuthContext";

const publicLinks = [
  { href: "/", label: "Strona główna", badge: "H" },
  { href: "/about", label: "O aplikacji", badge: "?" },
];

const authLinks = [
  { href: "/user/signin", label: "Logowanie", icon: FaSignInAlt },
  { href: "/user/register", label: "Rejestracja", icon: FaUserPlus },
];

const privateLinks = [
  { href: "/user/profile", label: "Profil", icon: FaUser },
  { href: "/games", label: "Moje gry", icon: FaGamepad },
  { href: "/user/signout", label: "Wyloguj", icon: FaSignOutAlt },
];

function NavItem({ href, label, icon: Icon, badge }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-gray-200 hover:bg-gray-800 hover:text-white transition-colors duration-200"
    >
      {Icon ? (
        <Icon className="w-5 h-5" />
      ) : (
        <span className="w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center text-[10px] font-semibold text-indigo-300">
          {badge}
        </span>
      )}
      <span>{label}</span>
    </Link>
  );
}

export default function AppShell({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen flex-col md:flex-row bg-gray-100">
      {/* Overlay for mobile */}
      <div
        className={`fixed inset-0 bg-black/50 transition-opacity duration-300 md:hidden ${
          sidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setSidebarOpen(false)}
      ></div>

      {/* Sidebar */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-72 bg-gray-900 text-white flex flex-col shadow-xl transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
          <div>
            <div className="text-xl font-bold tracking-tight">
              Gra w <span className="text-indigo-400">Kółko i Krzyżyk</span>
            </div>
            <p className="mt-1 text-xs text-gray-400">Panel użytkownika</p>
          </div>
          <button
            className="md:hidden text-gray-400 hover:text-white transition-colors"
            onClick={() => setSidebarOpen(false)}
            aria-label="Zamknij menu"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1 text-sm overflow-y-auto">
          <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-500">
            Publiczne
          </p>
          {publicLinks.map((link) => (
            <NavItem key={link.href} {...link} />
          ))}

          {!user && (
            <>
              <p className="px-3 pt-4 pb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-500">
                Autentykacja
              </p>
              {authLinks.map((link) => (
                <NavItem key={link.href} {...link} />
              ))}
            </>
          )}

          {user && (
            <>
              <p className="px-3 pt-4 pb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-500">
                Chronione
              </p>
              {privateLinks.map((link) => (
                <NavItem key={link.href} {...link} />
              ))}
            </>
          )}
        </nav>

        <div className="px-4 py-3 border-t border-gray-800 text-[11px] text-gray-500">
          © 2025 Gra w Kółko i Krzyżyk
        </div>
      </aside>

      {/* Content */}
      <div className="flex flex-1 flex-col min-h-screen md:ml-0">
        <Header onMenuToggle={() => setSidebarOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 bg-gray-50 overflow-y-auto">
          <div className="mx-auto w-full max-w-5xl">{children}</div>
        </main>
        <footer className="h-14 bg-gray-900 text-gray-300 text-xs flex items-center justify-center border-t border-gray-800 px-4">
          <div className="text-center">
            Gra w Kółko i Krzyżyk – Next.js · Tailwind CSS · Firebase
          </div>
        </footer>
      </div>
    </div>
  );
}
