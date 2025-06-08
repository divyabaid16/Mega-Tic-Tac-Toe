"use client";

import { useState } from "react";

const emptyBoard = () =>
  Array(3)
    .fill(null)
    .map(() => Array(3).fill(null));

function LocalBoard({ board, onClick, disabled }) {
  return (
    <div className="grid grid-cols-3 gap-1 border p-1">
      {board.map((row, i) =>
        row.map((cell, j) => (
          <button
            key={`${i}-${j}`}
            className="w-12 h-12 border text-xl font-bold"
            onClick={() => onClick(i, j)}
            disabled={disabled || cell !== null}
          >
            {cell}
          </button>
        ))
      )}
    </div>
  );
}

export default function MegaTicTacToe() {
  const initBoards = () =>
    Array(3)
      .fill(null)
      .map(() => Array(3).fill(null).map(emptyBoard));
  const [boards, setBoards] = useState(initBoards);
  const [owners, setOwners] = useState(emptyBoard());
  const [currentPlayer, setCurrentPlayer] = useState("X");
  const [nextBoard, setNextBoard] = useState(null);
  const [winner, setWinner] = useState(null);

  const checkWinner = (board) => {
    const lines = [
      ...board,
      ...[0, 1, 2].map((i) => board.map((row) => row[i])),
      [0, 1, 2].map((i) => board[i][i]),
      [0, 1, 2].map((i) => board[i][2 - i]),
    ];
    for (const line of lines) {
      if (line[0] && line.every((cell) => cell === line[0])) return line[0];
    }
    return null;
  };

  const handleMove = (bi, bj, i, j) => {
    if (winner || (nextBoard && (bi !== nextBoard[0] || bj !== nextBoard[1])))
      return;
    if (owners[bi][bj]) return;
    const newBoards = boards.map((row, x) =>
      row.map((b, y) =>
        x === bi && y === bj
          ? b.map((r, m) =>
              r.map((c, n) => (m === i && n === j ? currentPlayer : c))
            )
          : b
      )
    );

    const newLocal = newBoards[bi][bj];
    const localWinner = checkWinner(newLocal);
    const newOwners = owners.map((row, x) =>
      row.map((c, y) => (x === bi && y === bj ? localWinner || c : c))
    );
    const globalWinner = checkWinner(newOwners);

    setBoards(newBoards);
    setOwners(newOwners);
    setWinner(globalWinner);
    setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
    if (!newOwners[i][j]) {
      setNextBoard([i, j]);
    } else {
      setNextBoard(null);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <h1 className="text-2xl font-bold">Mega Tic-Tac-Toe</h1>
      {winner && <div className="text-xl font-semibold">Winner: {winner}</div>}
      <div className="grid grid-cols-3 gap-2">
        {boards.map((row, i) =>
          row.map((board, j) => (
            <div
              key={`${i}-${j}`}
              className={`p-1 border-2 rounded ${
                nextBoard === null || (nextBoard[0] === i && nextBoard[1] === j)
                  ? "border-black"
                  : "border-gray-300 opacity-50"
              }`}
              style={{
                opacity:
                  nextBoard === null ||
                  (nextBoard[0] === i && nextBoard[1] === j)
                    ? 1
                    : 0.5,
                width: "100%",
                height: "100%",
              }}
            >
              {owners[i][j] ? (
                <div className="flex items-center justify-center w-full h-full text-2xl font-bold">
                  {owners[i][j]}
                </div>
              ) : (
                <LocalBoard
                  board={board}
                  disabled={
                    !!owners[i][j] ||
                    (nextBoard && (nextBoard[0] !== i || nextBoard[1] !== j))
                  }
                  onClick={(x, y) => handleMove(i, j, x, y)}
                />
              )}
            </div>
          ))
        )}
      </div>
      <div className="text-md mt-4">Current Player: {currentPlayer}</div>
    </div>
  );
}
