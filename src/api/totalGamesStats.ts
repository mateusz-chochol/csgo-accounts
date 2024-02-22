import { doc, getDocs, updateDoc } from "firebase/firestore";
import { TotalGamesStats } from "../types";
import { totalGamesStatsRef } from "./firestoreRefs";
import { db } from "../firebase";

export const fetchTotalGamesStats = async (): Promise<TotalGamesStats> => {
  const totalGamesStatsSnapshot = await getDocs(totalGamesStatsRef);

  const totalGamesStats = totalGamesStatsSnapshot.docs.map<TotalGamesStats>(
    (doc) => {
      const data = doc.data();

      return {
        docId: doc.id,
        kicks: data.kicks,
        bans: data.bans,
        gamesPlayed: data.gamesPlayed,
      };
    }
  );

  return totalGamesStats[0];
};

export const updateTotalKicksAndBans = async (
  docId: string,
  gamesPlayed: number,
  kicks: number,
  bans: number
): Promise<void> => {
  return await updateDoc(doc(db, "totalGamesStats", docId), {
    kicks,
    bans,
    gamesPlayed,
  });
};
