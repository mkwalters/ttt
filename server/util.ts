import { Game } from "./model";

export const generateFourDigitCode = (): string => {
  // Generate a random number between 1000 and 9999
  const code = Math.floor(1000 + Math.random() * 9000);

  // Convert the number to a string and return it
  return code.toString();
};

export const chooseRandomXO = (): "x" | "o" => {
  // Generate a random number between 0 and 1
  const randomNum = Math.random();

  // If the number is less than 0.5, choose 'x', otherwise choose 'o'
  return randomNum < 0.5 ? "x" : "o";
};

export const initializeGame = (creatorPieces: string): Game => {
  return {
    board: Array(9).fill(null),
    piecesToPlay: "x",
    status: "pending",
    creatorPieces,
  };
};
