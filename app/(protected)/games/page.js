"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/app/lib/firebase";
import { useAuth } from "@/app/lib/AuthContext";
import { createNewGame } from "@/app/lib/games";

export default function GamesPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [creating, setCreating] = useState(false);
  const [customSize, setCustomSize] = useState(5);

  useEffect(() => {
    const fetchGames = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const gamesRef = collection(db, "games");
        const q = query(gamesRef, where("userId", "==", user.uid));

        const snapshot = await getDocs(q);
        const userGames = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Sortowanie po stronie klienta po polu createdAt (jeśli jest)
        userGames.sort((a, b) => {
          const aTime = a.createdAt?.toMillis?.() ?? 0;
          const bTime = b.createdAt?.toMillis?.() ?? 0;
          return bTime - aTime; // nowsze najpierw
        });

        setGames(userGames);
      } catch (err) {
        console.error("Błąd pobierania gier:", err);
        setError("Nie udało się pobrać listy gier.");
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, [user]);

  const handleCreateGame = async (boardSize) => {
    if (!user || creating) return;
    setCreating(true);
    setError("");

    try {
      const gameId = await createNewGame({ userId: user.uid, boardSize });
      router.push(`/games/${gameId}`);
    } catch (e) {
      console.error("Błąd tworzenia gry:", e);
      setError("Nie udało się utworzyć nowej gry.");
      setCreating(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-600">
          Musisz być zalogowany, aby zobaczyć swoje gry.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Twoje gry w kółko i krzyżyk
          </h1>
          <p className="text-sm text-gray-600">
            Lista gier zapisanych w kolekcji{" "}
            <span className="font-mono">games</span>, należących do
            zalogowanego użytkownika.
          </p>
        </div>
        <div className="flex flex-col items-end gap-3">
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <label htmlFor="customSize" className="font-medium">
              Własny rozmiar (3–15):
            </label>
            <input
              id="customSize"
              type="number"
              min={3}
              max={15}
              value={customSize}
              onChange={(e) =>
                setCustomSize(
                  Math.max(3, Math.min(15, Number(e.target.value) || 3))
                )
              }
              className="w-20 px-2 py-1 border border-gray-300 rounded text-center text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleCreateGame(5)}
              disabled={creating}
              className="px-4 py-2 rounded-lg bg-gray-100 text-gray-800 text-sm font-semibold hover:bg-gray-200 disabled:opacity-50"
            >
              Nowa gra 5×5
            </button>
            <button
              type="button"
              onClick={() => handleCreateGame(10)}
              disabled={creating}
              className="px-4 py-2 rounded-lg bg-gray-100 text-gray-800 text-sm font-semibold hover:bg-gray-200 disabled:opacity-50"
            >
              Nowa gra 10×10
            </button>
            <button
              type="button"
              onClick={() => handleCreateGame(customSize)}
              disabled={creating}
              className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50"
            >
              Nowa gra {customSize}×{customSize}
            </button>
          </div>
          <p className="text-[11px] text-gray-500 text-right">
            Dla plansz &lt; 5 wygrywają 3 w linii, dla większych 5 w linii.
          </p>
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-10">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {!loading && !error && games.length === 0 && (
        <div className="p-6 bg-white border border-dashed border-gray-300 rounded-lg text-center text-gray-500">
          Nie masz jeszcze żadnych zapisanych gier. Kliknij{" "}
          <span className="font-semibold">„Nowa gra”</span>, aby rozpocząć.
        </div>
      )}

      {!loading && !error && games.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2">
          {games.map((game) => (
            <button
              key={game.id}
              type="button"
              onClick={() => router.push(`/games/${game.id}`)}
              className="text-left bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex flex-col gap-2 hover:border-indigo-300 hover:shadow-md transition"
            >
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-gray-900">
                  Gra {game.boardSize}×{game.boardSize}
                </h2>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    game.status === "in-progress"
                      ? "bg-yellow-100 text-yellow-800"
                      : game.status === "won"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {game.status === "in-progress"
                    ? "W toku"
                    : game.status === "won"
                    ? `Wygrana: ${game.winner}`
                    : "Remis"}
                </span>
              </div>

              <div className="text-sm text-gray-600">
                <p>
                  Ruchy X:{" "}
                  <span className="font-medium text-indigo-600">
                    {game.movesCountX ?? 0}
                  </span>
                  , ruchy O:{" "}
                  <span className="font-medium text-rose-600">
                    {game.movesCountO ?? 0}
                  </span>
                </p>
                <p>
                  Wolne pola:{" "}
                  <span className="font-medium">{game.freeCells ?? 0}</span>
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
