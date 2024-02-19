import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebase";

export const addGame = async () => {
  // Create a reference to the Firestore service
  const gamesCollectionRef = collection(db, "games");

  try {
    // Add a new document with a generated ID
    const docRef = await addDoc(gamesCollectionRef, {
      name: "New Game",
      genre: "Adventure",
      releaseYear: 2023,
      // Add other game details here
    });

    console.log("Game added with ID: ", docRef.id);
  } catch (error) {
    console.error("Error adding document: ", error);
  }
};
