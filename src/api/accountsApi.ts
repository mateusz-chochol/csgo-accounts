import {
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { Account } from "../types";
import { accountsRef } from "./firestoreRefs";
import { db } from "../firebase";

export const fetchUserAccounts = async (userId: string): Promise<Account[]> => {
  const accountsQuery = query(accountsRef, where("ownerId", "==", userId));
  const accountsSnapshot = await getDocs(accountsQuery);

  const accounts = accountsSnapshot.docs.map<Account>((doc) => {
    const data = doc.data();

    return {
      id: doc.id,
      ownerId: data.ownerId,
      displayName: data.displayName,
      banUntil: data.banUntil || null,
    };
  });

  return accounts;
};

export const banAccount = async (
  accountId: string,
  banUntil: string
): Promise<void> => {
  return await updateDoc(doc(db, "accounts", accountId), { banUntil });
};

export const unbanAccount = async (accountId: string): Promise<void> => {
  return await updateDoc(doc(db, "accounts", accountId), { banUntil: null });
};

export const changeAccountName = async (
  accountId: string,
  newName: string
): Promise<void> => {
  return await updateDoc(doc(db, "accounts", accountId), {
    displayName: newName,
  });
};

export const deleteAccount = async (accountId: string): Promise<void> => {
  return await deleteDoc(doc(db, "accounts", accountId));
};

export const addNewAccount = async (
  accountName: string,
  ownerId: string
): Promise<void> => {
  await addDoc(accountsRef, {
    displayName: accountName,
    ownerId,
  });
};
