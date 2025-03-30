"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { onAuthStateChanged, User } from "firebase/auth";

export default function HistoryPage() {
  const [user, setUser] = useState<User | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      setUser(firebaseUser);

      try {
        const diaryRef = collection(db, "users", firebaseUser.uid, "diaries");
        const snapshot = await getDocs(diaryRef);
        const fetched = snapshot.docs.map((doc) => ({
          date: doc.id,
          ...doc.data(),
        }));

        setHistory(fetched);
      } catch (error) {
        console.error("Firestore에서 데이터 불러오기 실패", error);
      } finally {
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center sm:ml-0 ml-48 text-gray-500 px-4 text-center">
        ⏳ 일기를 불러오는 중입니다...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center sm:ml-0 ml-48 text-gray-500 px-4 text-center">
        🔐 로그인이 필요합니다.
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-6 sm:px-4 sm:ml-0 ml-48 bg-gradient-to-b from-pink-50 to-white">
      <h1 className="text-2xl sm:text-xl font-bold text-pink-700 mb-6 text-center">
        📘 지난 일기
      </h1>

      <ul className="space-y-4">
        {history.length > 0 ? (
          history.map((item, idx) => (
            <li key={idx} className="bg-white p-4 sm:p-3 rounded-xl shadow text-sm sm:text-base">
              <div className="text-xs text-gray-500 mb-1">{item.date}</div>
              <div className="text-base">{item.emotion} {item.entry}</div>
            </li>
          ))
        ) : (
          <p className="text-gray-500 text-center">저장된 일기가 아직 없어요 🥲</p>
        )}
      </ul>
    </div>
  );
}
