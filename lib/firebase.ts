// lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBLq1MNBDCTKIEGgB92Uz4HX-YhunQiJlE",
  authDomain: "rema-in-me.firebaseapp.com",
  projectId: "rema-in-me",
  storageBucket: "rema-in-me.appspot.com",
  messagingSenderId: "610192112145", // 정확하지 않아도 작동함
  appId: "1:610192112145:web:96d86220cb703c07cc0fb0", // 나중에 복사해도 돼!
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
