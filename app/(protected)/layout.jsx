'use client'
import { useAuth } from "@/app/lib/AuthContext";
import { useLayoutEffect } from "react";
import { useRouter, usePathname } from 'next/navigation';

function Protected({children}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const returnUrl = usePathname();

  useLayoutEffect(() => {
    if (!loading && !user) {
      router.push(`/user/signin?returnUrl=${encodeURIComponent(returnUrl)}`);
    }
  }, [user, loading, returnUrl, router]);

  // Pokazuj loading podczas sprawdzania autentykacji
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600">Sprawdzanie autoryzacji...</p>
        </div>
      </div>
    );
  }

  // Jeśli użytkownik nie jest zalogowany, nie renderuj dzieci (nastąpi przekierowanie)
  if (!user) {
    return null;
  }

  return (
    <>
      { children }
    </>
  );
}

export default Protected;

