export interface Game {
  board: Array<string | null>;
  piecesToPlay: string;
  status: string;
  creatorPieces: string;
}

export interface GameCache {
  [key: string]: Game;
}
