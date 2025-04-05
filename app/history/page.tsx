"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function HistoryPage() {
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    const fetchHistory = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const diaryRef = collection(db, "users", user.uid, "diaries");
      const snapshot = await getDocs(diaryRef);
      const fetched = snapshot.docs.map(doc => ({
        date: doc.id,
        ...doc.data(),
      }));

      setHistory(fetched);
    };

    fetchHistory();
  }, []);

  return (
    <div className="min-h-screen px-4 py-10 sm:ml-48 ml-0 bg-gradient-to-b from-pink-50 to-white">
      <h1 className="text-2xl sm:text-xl font-bold text-pink-600 mb-6 text-center">
        Diary
      </h1>

      <div className="w-full max-w-md mx-auto space-y-4">
        {history.length === 0 ? (
          <p className="text-center text-sm text-gray-500">아직 저장된 일기가 없어요.</p>
        ) : (
          history.map((item, idx) => (
            <div key={idx} className="bg-white p-4 rounded-xl shadow text-left text-sm">
              <div className="text-xs text-gray-500">{item.date}</div>
              <div className="mt-1">{item.emotion} {item.entry}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
