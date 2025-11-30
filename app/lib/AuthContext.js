"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

// Utworzenie kontekstu autentykacji
const AuthContext = createContext({});

// Provider komponentu autentykacji
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Subskrypcja do zmian stanu autentykacji
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    // Czyszczenie subskrypcji przy odmontowaniu komponentu
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook do używania kontekstu autentykacji
export function useAuth() {
  return useContext(AuthContext);
}

