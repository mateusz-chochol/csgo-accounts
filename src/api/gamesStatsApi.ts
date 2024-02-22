import {
  addDoc,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
} from "firebase/firestore";
import { gamesStatsRef } from "./firestoreRefs";
import { GameStats, TotalGamesStats, User } from "../types";
import { updateUsersKicksAndBans } from "./usersApi";
import { db } from "../firebase";
import { updateTotalKicksAndBans } from "./totalGamesStats";

const convertDocToGameStats = (doc: any): GameStats => {
  const data = doc.data();

  return {
    id: doc.id,
    date: data.date,
    kicks: data.kicks,
    bans: data.bans,
    usersInvolved: data.usersInvolved,
    timestamp: data.timestamp,
  };
};

export const fetchGamesStats = async (): Promise<GameStats[]> => {
  const gamesStatsSnapshot = await getDocs(gamesStatsRef);
  const gamesStats = gamesStatsSnapshot.docs.map<GameStats>(
    convertDocToGameStats
  );

  return gamesStats;
};

export const fetchLastGameStats = async (): Promise<GameStats | null> => {
  const q = query(gamesStatsRef, orderBy("timestamp", "desc"), limit(1));
  const gamesStatsSnapshot = await getDocs(q);
  const gamesStats = gamesStatsSnapshot.docs.map<GameStats>(
    convertDocToGameStats
  );

  return gamesStats[0] || null;
};

export const addNewGameStats = async (
  date: string,
  timestamp: number,
  kicks: number,
  bans: number,
  usersInvolved: string[],
  allUsers: User[],
  totalGamesStats: TotalGamesStats
): Promise<void> => {
  const addGameStatsPromise = addDoc(gamesStatsRef, {
    date,
    timestamp,
    kicks,
    bans,
    usersInvolved,
  });

  const updateTotalKicksAndBansPromise = updateTotalKicksAndBans(
    totalGamesStats.docId,
    totalGamesStats.gamesPlayed + 1,
    totalGamesStats.kicks + kicks,
    totalGamesStats.bans + bans
  );

  const updateUsersPromises = usersInvolved.reduce<Promise<void>[]>(
    (promises, userId) => {
      const user = allUsers.find((user) => user.id === userId);

      if (user) {
        const updatedKicks = user.kicks + kicks;
        const updatedBans = user.bans + bans;

        return [
          ...promises,
          updateUsersKicksAndBans(userId, updatedKicks, updatedBans),
        ];
      }

      return promises;
    },
    []
  );

  await Promise.all([
    addGameStatsPromise,
    updateTotalKicksAndBansPromise,
    ...updateUsersPromises,
  ]);
};

export const deleteGameStats = async (
  gameStatsId: string,
  kicks: number,
  bans: number,
  usersInvolved: string[],
  allUsers: User[],
  totalGamesStats: TotalGamesStats
): Promise<void> => {
  const docRef = doc(db, "gamesStats", gameStatsId);
  const doesDocumentStillExist = (await getDoc(docRef)).exists();

  if (!doesDocumentStillExist) {
    return;
  }

  const deleteGameStatsPromise = deleteDoc(doc(db, "gamesStats", gameStatsId));

  const updateTotalKicksAndBansPromise = updateTotalKicksAndBans(
    totalGamesStats.docId,
    totalGamesStats.gamesPlayed - 1,
    totalGamesStats.kicks - kicks,
    totalGamesStats.bans - bans
  );

  const updateUsersPromises = usersInvolved.reduce<Promise<void>[]>(
    (promises, userId) => {
      const user = allUsers.find((user) => user.id === userId);

      if (user) {
        const updatedKicks = user.kicks - kicks;
        const updatedBans = user.bans - bans;

        return [
          ...promises,
          updateUsersKicksAndBans(userId, updatedKicks, updatedBans),
        ];
      }

      return promises;
    },
    []
  );

  await Promise.all([
    deleteGameStatsPromise,
    updateTotalKicksAndBansPromise,
    ...updateUsersPromises,
  ]);
};
