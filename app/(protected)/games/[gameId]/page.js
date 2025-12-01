"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/app/lib/firebase";
import { useAuth } from "@/app/lib/AuthContext";

function checkWinner(board, boardSize, symbol) {
  // dla mniejszych plansz (np. 3x3, 4x4) wystarczą 3 symbole,
  // dla większych (>=5) wymagamy 5 w linii
  const needed = boardSize < 5 ? 3 : 5;

  const get = (r, c) => {
    if (r < 0 || c < 0 || r >= boardSize || c >= boardSize) return null;
    return board[r * boardSize + c];
  };

  // sprawdź wszystkie pola jako potencjalny początek linii
  for (let r = 0; r < boardSize; r++) {
    for (let c = 0; c < boardSize; c++) {
      if (get(r, c) !== symbol) continue;

      // kierunki: poziomo, pionowo, ukośnie /
      const directions = [
        [0, 1],
        [1, 0],
        [1, 1],
        [1, -1],
      ];

      for (const [dr, dc] of directions) {
        let count = 0;
        for (let k = 0; k < needed; k++) {
          if (get(r + dr * k, c + dc * k) === symbol) {
            count++;
          } else {
            break;
          }
        }
        if (count === needed) {
          return true;
        }
      }
    }
  }

  return false;
}

export default function GamePage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const boardSize = game?.boardSize ?? 0;
  const isOwner = useMemo(
    () => !!user && !!game && game.userId === user.uid,
    [user, game]
  );

  useEffect(() => {
    const fetchGame = async () => {
      try {
        if (!params?.gameId) {
          setError("Brak identyfikatora gry w adresie URL.");
          return;
        }

        const gameId =
          typeof params.gameId === "string" ? params.gameId : params.gameId[0];

        const ref = doc(db, "games", gameId);
        const snap = await getDoc(ref);
        if (!snap.exists()) {
          setError("Gra nie istnieje.");
        } else {
          setGame({ id: snap.id, ...snap.data() });
        }
      } catch (err) {
        console.error("Błąd pobierania gry:", err);
        setError(
          err?.message || "Nie udało się pobrać gry (sprawdź reguły Firestore)."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchGame();
  }, [params]);

  const handleCellClick = async (index) => {
    if (!game || !isOwner) return;
    if (saving) return;
    if (game.status !== "in-progress") return;
    if (!Array.isArray(game.board) || game.board[index]) return;

    const symbol = game.currentPlayer || "X";
    const board = [...game.board];
    board[index] = symbol;

    const movesCountX = game.movesCountX + (symbol === "X" ? 1 : 0);
    const movesCountO = game.movesCountO + (symbol === "O" ? 1 : 0);
    const freeCells = Math.max(0, game.freeCells - 1);

    let status = "in-progress";
    let winner = null;

    if (checkWinner(board, game.boardSize, symbol)) {
      status = "won";
      winner = symbol;
    } else if (freeCells === 0) {
      status = "draw";
    }

    const nextPlayer = symbol === "X" ? "O" : "X";

    const updatedGame = {
      ...game,
      board,
      movesCountX,
      movesCountO,
      freeCells,
      status,
      winner,
      currentPlayer: status === "in-progress" ? nextPlayer : game.currentPlayer,
    };

    setSaving(true);
    setError("");

    try {
      const ref = doc(db, "games", game.id);
      await updateDoc(ref, {
        board,
        movesCountX,
        movesCountO,
        freeCells,
        status,
        winner,
        currentPlayer:
          status === "in-progress" ? nextPlayer : game.currentPlayer,
        updatedAt: serverTimestamp(),
      });

      setGame(updatedGame);
    } catch (err) {
      console.error("Błąd zapisu ruchu:", err);
      setError("Nie udało się zapisać ruchu.");
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-600">
          Musisz być zalogowany, aby grać w kółko i krzyżyk.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-600">{error || "Nie znaleziono gry."}</p>
      </div>
    );
  }

  const statusLabel =
    game.status === "in-progress"
      ? `Tura: ${game.currentPlayer}`
      : game.status === "won"
      ? `Wygrana: ${game.winner}`
      : "Remis";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Gra w kółko i krzyżyk
          </h1>
          <p className="text-sm text-gray-600">
            Plansza {boardSize}×{boardSize}. Aby wygrać, ustaw{" "}
            {boardSize < 5 ? "trzy" : "pięć"} symbole w linii.
          </p>
        </div>
        <button
          type="button"
          onClick={() => router.push("/games")}
          className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
        >
          ← Wróć do listy gier
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 text-sm text-gray-700">
          <span className="font-semibold">Status:</span>
          <span>{statusLabel}</span>
        </div>
        <div className="flex gap-4 text-sm text-gray-700">
          <span>
            Ruchy X:{" "}
            <span className="font-semibold text-indigo-600">
              {game.movesCountX}
            </span>
          </span>
          <span>
            Ruchy O:{" "}
            <span className="font-semibold text-rose-600">
              {game.movesCountO}
            </span>
          </span>
          <span>
            Wolne pola:{" "}
            <span className="font-semibold">{game.freeCells}</span>
          </span>
        </div>
      </div>

      {!isOwner && (
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
          Ta gra nie należy do Ciebie – możesz ją tylko podglądać.
        </div>
      )}

      <div
        className="inline-grid bg-white shadow-lg rounded-lg p-3 border border-gray-200"
        style={{
          gridTemplateColumns: `repeat(${boardSize}, minmax(0, 1fr))`,
          gap: 4,
        }}
      >
        {game.board.map((cell, index) => (
          <button
            key={index}
            type="button"
            onClick={() => handleCellClick(index)}
            disabled={
              saving ||
              !isOwner ||
              game.status !== "in-progress" ||
              Boolean(cell)
            }
            className={`flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 border rounded-md text-2xl font-bold transition
            ${
              cell === "X"
                ? "text-indigo-600 border-indigo-300 bg-indigo-50"
                : cell === "O"
                ? "text-rose-600 border-rose-300 bg-rose-50"
                : "text-gray-400 border-gray-200 hover:border-indigo-300 hover:bg-indigo-50"
            }
            ${
              !cell && (!isOwner || game.status !== "in-progress")
                ? "cursor-not-allowed opacity-60"
                : ""
            }`}
          >
            {cell || ""}
          </button>
        ))}
      </div>
    </div>
  );
}


