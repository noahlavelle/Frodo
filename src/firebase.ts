import {initializeApp} from 'firebase/app';
import {getDatabase, ref, set, get} from 'firebase/database';

const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG);

initializeApp(firebaseConfig);
const database = getDatabase();
const leaderboardRef = ref(database, 'leaderboard');
const leaderboardObjRef = ref(database, 'leaderboardObj');

export const getLeaderboardObj = () => get(leaderboardObjRef);
export const setLeaderboardObj = (leaderboard) => set(leaderboardObjRef, leaderboard);
export const setLeaderboard = (leaderboard) => set(leaderboardRef, leaderboard);
