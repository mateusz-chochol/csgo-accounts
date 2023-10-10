import { collection } from "firebase/firestore";
import { db } from "../firebase";

export const accountsRef = collection(db, "accounts");
export const usersRef = collection(db, "users");
