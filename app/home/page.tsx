"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { motion } from "framer-motion";

export default function HomePage() {
  const [interactionScore, setInteractionScore] = useState(0);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) return;

      const diaryRef = collection(db, "users", user.uid, "diaries");
      const chatRef = collection(db, "users", user.uid, "chats");

      try {
        const diarySnapshot = await getDocs(diaryRef);
        const chatSnapshot = await getDocs(chatRef);

        const diaryCount = diarySnapshot.size;
        const chatCount = chatSnapshot.size;

        setInteractionScore(diaryCount * 3 + chatCount); // 예: 일기 3점 + 대화 1점
      } catch (err) {
        console.error("데이터 불러오기 실패:", err);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-100 to-white px-6 py-10 sm:ml-48 ml-0 relative text-center flex flex-col items-center justify-center">
      {/* 기억세포 점수 우측 상단 */}
      <div className="absolute top-6 right-6 bg-white/80 px-4 py-2 rounded-full shadow text-pink-500 text-sm font-semibold">
        우리의 기억: <span className="text-pink-600 font-bold">{interactionScore}</span>
      </div>

      {/* 감성 문구 */}
      <motion.p
        className="text-lg sm:text-xl text-gray-600 mt-4 font-light"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        이 공간에 머무는 시간, 그 자체가 기록이에요.
      </motion.p>
    </div>
  );
}
