import { getDocs } from "firebase/firestore";
import { User } from "../types";
import { usersRef } from "./firestoreRefs";

export const fetchUsers = async (): Promise<User[]> => {
  const usersSnapshot = await getDocs(usersRef);

  const users = usersSnapshot.docs.map<User>((doc) => {
    const data = doc.data();

    return {
      id: doc.id,
      displayName: data.displayName,
    };
  });

  return users;
};
