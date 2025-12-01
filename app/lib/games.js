import { db } from "@/app/lib/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

/**
 * Tworzy nowy dokument gry w kolekcji "games".
 * @param {Object} params
 * @param {string} params.userId - uid zalogowanego użytkownika (user.uid).
 * @param {number} [params.boardSize=5] - rozmiar planszy (nxn).
 * @param {Object} [params.settings={}] - opcjonalne ustawienia wyglądu planszy.
 * @returns {Promise<string>} - ID utworzonego dokumentu gry.
 */
export async function createNewGame({
  userId,
  boardSize = 5,
  settings = {},
} = {}) {
  if (!userId) {
    throw new Error("Brak identyfikatora użytkownika (userId).");
  }

  // ograniczenie wielkości planszy
  const size = Math.max(3, Math.min(15, Number(boardSize) || 5));

  const freeCells = size * size;

  // Liniowa tablica pól (np. dla 5x5 będzie 25 elementów)
  const emptyBoard = Array(freeCells).fill("");

  const docRef = await addDoc(collection(db, "games"), {
    userId, // używane w regułach bezpieczeństwa
    boardSize: size,
    board: emptyBoard,
    currentPlayer: "X",
    movesCountX: 0,
    movesCountO: 0,
    freeCells,
    status: "in-progress", // 'in-progress' | 'won' | 'draw'
    winner: null, // 'X' | 'O' | null
    settings: {
      boardColor: settings.boardColor || "#ffffff",
      symbolColorX: settings.symbolColorX || "#1d4ed8",
      symbolColorO: settings.symbolColorO || "#dc2626",
      borderColor: settings.borderColor || "#e5e7eb",
      cellSize: settings.cellSize || 48,
    },
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return docRef.id;
}


