import {
  addDoc,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { Account } from "../types";
import { accountsRef } from "./firestoreRefs";
import { db } from "../firebase";
import { getBanUntilAsDate } from "../utils";
import { MS_PER_SECOND } from "../consts";

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
      banCounter: data.banCounter || 0,
      totalBanTime: data.totalBanTime || 0,
      lastBanTime: data.lastBanTime || 0,
      previousLastBanTime: data.previousLastBanTime || 0,
    };
  });

  return accounts;
};

export const banAccount = async (
  accountId: string,
  banUntil: string
): Promise<void> => {
  const accountRef = doc(db, "accounts", accountId);
  const accountSnapshot = await getDoc(accountRef);
  const accountData = accountSnapshot.data();

  const banUntilDate = getBanUntilAsDate(banUntil);
  const banUntilTimestamp = banUntilDate.getTime();
  const currentDateTimestamp = Date.now();

  const banTimeTimestamp = Math.ceil(
    (banUntilTimestamp - currentDateTimestamp) / MS_PER_SECOND
  );

  return await updateDoc(accountRef, {
    banUntil,
    banCounter: accountData?.banCounter + 1 || 1,
    totalBanTime:
      accountData?.totalBanTime + banTimeTimestamp || banTimeTimestamp,
    lastBanTime: banTimeTimestamp,
    previousLastBanTime: accountData?.lastBanTime || 0,
  });
};

export const unbanAccount = async (accountId: string): Promise<void> => {
  const accountRef = doc(db, "accounts", accountId);
  const accountSnapshot = await getDoc(accountRef);
  const accountData = accountSnapshot.data();

  const lastBanTime = accountData?.lastBanTime || 0;

  return await updateDoc(accountRef, {
    banUntil: null,
    banCounter: accountData?.banCounter - 1 || 0,
    totalBanTime: accountData?.totalBanTime - lastBanTime || 0,
    lastBanTime: accountData?.previousLastBanTime || 0,
    previousLastBanTime: 0,
  });
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
    banCounter: 0,
    totalBanTime: 0,
    lastBanTime: 0,
  });
};
