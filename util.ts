export const checkWinner = (board: Array<string | null>) => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
};

export const getDomain = (operatingSystem: string): string => {
  let domain = "localhost";
  if (operatingSystem === "android") {
    domain = "10.0.2.2";
  }
  return domain;
};

export const createGame = async (operatingSystem: string) => {
  const res = await fetch(
    `http://${getDomain(operatingSystem)}:9999/game/new`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return res;
};

export const joinGame = async (code: string, operatingSystem: string) => {
  const data = {
    code,
  };

  const res = await fetch(
    `http://${getDomain(operatingSystem)}:9999/game/join`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data), // Convert the JavaScript object to a JSON string
    }
  );
  return res;
};

export const getRandomCongrats = (): string => {
  return getRandomElement(["Excelsior!", "Great job!", "You rock!"]);
};

export const getRandomCondolences = (): string => {
  return getRandomElement([
    "Better luck next time!",
    "You'll get 'em next time!",
    "Don't worry, it's how champions are built!",
  ]);
};
const getRandomElement = (items: any): string => {
  return items[Math.floor(Math.random() * items.length)];
};
