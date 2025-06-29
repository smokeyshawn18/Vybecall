import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth";
import {
  getDatabase,
  ref,
  set,
  onDisconnect,
  onValue,
  remove,
  off,
  type Unsubscribe,
  get,
} from "firebase/database";

// 🔐 Firebase Config
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET, // You can keep this, but not used for avatar upload now
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// 🔧 Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

// 🕒 Realtime Database server timestamp
export const serverTimestamp = { ".sv": "timestamp" };

//
// 🔁 Presence Management
//
export const setUserOnline = (userID: string, userName: string) => {
  const userRef = ref(db, `onlineUsers/${userID}`);
  set(userRef, {
    userID,
    userName,
    lastSeen: Date.now(),
  });
  onDisconnect(userRef).remove();
};

export const setUserOffline = (userID: string) => {
  const userRef = ref(db, `onlineUsers/${userID}`);
  remove(userRef);
};

export async function isUserIDTaken(userID: string): Promise<boolean> {
  const userRef = ref(db, `users/${userID}`);
  const snapshot = await get(userRef);
  return snapshot.exists();
}

export async function checkUserExists(
  userID: string,
  userName: string
): Promise<boolean> {
  const userRef = ref(db, `users/${userID}`);
  const snapshot = await get(userRef);

  if (!snapshot.exists()) return false;

  const userData = snapshot.val();
  return userData.userName === userName;
}

/**
 * Save user profile in Realtime Database.
 * avatarURL should be the ImgBB URL you get after upload.
 */
export const saveUserProfile = async (
  userID: string,
  userName: string,
  avatarURL?: string
) => {
  const userRef = ref(db, `users/${userID}`);
  await set(userRef, {
    userID,
    userName,
    avatarURL: avatarURL || null,
    registeredAt: Date.now(),
  });
};

export const subscribeOnlineUsers = (
  callback: (users: Record<string, any>) => void
): Unsubscribe => {
  const usersRef = ref(db, "onlineUsers");

  const listener = (snapshot: any) => {
    callback(snapshot.val() || {});
  };

  onValue(usersRef, listener);

  return () => off(usersRef, "value", listener);
};

//
// ✨ Export Auth + DB modules
//
export {
  auth,
  db,
  ref,
  set,
  remove,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
};

export type { User };
