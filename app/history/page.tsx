"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export default function HistoryPage() {
  const [history, setHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      const diaryRef = collection(db, "users", user.uid, "diaries");
      getDocs(diaryRef).then((snapshot) => {
        const fetched = snapshot.docs.map((doc) => ({
          date: doc.id,
          ...doc.data(),
        }));

        setHistory(fetched);
        setIsLoading(false);
      });
    });

    return () => unsubscribe();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center ml-48 bg-white text-gray-500">
        ⏳ 일기를 불러오는 중입니다...
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 ml-48 bg-gradient-to-b from-pink-50 to-white">
      <h1 className="text-2xl font-bold text-pink-700 mb-4">📘 지난 일기</h1>
      <ul className="space-y-4">
        {history.length > 0 ? (
          history.map((item, idx) => (
            <li key={idx} className="bg-white p-4 rounded-xl shadow-md">
              <div className="text-xs text-gray-500 mb-1">{item.date}</div>
              <div className="text-lg">{item.emotion} {item.entry}</div>
            </li>
          ))
        ) : (
          <p className="text-gray-500">저장된 일기가 없어요 😢</p>
        )}
      </ul>
    </div>
  );
}
