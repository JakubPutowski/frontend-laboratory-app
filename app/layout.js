import "./globals.css";
import { AuthProvider } from "@/app/lib/AuthContext";
import AppShell from "@/app/components/AppShell";

export const metadata = {
  title: "Gra w Kółko i Krzyżyk",
  description: "Gra w kółko i krzyżyk z autentykacją Firebase",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pl">
      <body className="min-h-screen bg-gray-100">
        <AuthProvider>
          <AppShell>{children}</AppShell>
        </AuthProvider>
      </body>
    </html>
  );
}
