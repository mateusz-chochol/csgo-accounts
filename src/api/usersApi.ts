import { doc, getDocs, updateDoc } from "firebase/firestore";
import { User } from "../types";
import { usersRef } from "./firestoreRefs";
import { db } from "../firebase";

export const fetchUsers = async (): Promise<User[]> => {
  const usersSnapshot = await getDocs(usersRef);

  const users = usersSnapshot.docs.map<User>((doc) => {
    const data = doc.data();

    return {
      id: doc.id,
      displayName: data.displayName,
      kicks: data.kicks,
      bans: data.bans,
      gamesPlayed: data.gamesPlayed,
    };
  });

  return users;
};

export const updateUsersKicksAndBans = async (
  userId: string,
  kicks: number,
  bans: number,
  gamesPlayed: number
): Promise<void> => {
  return await updateDoc(doc(db, "users", userId), {
    kicks,
    bans,
    gamesPlayed,
  });
};
