"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";

export default function WritePage() {
  const [entry, setEntry] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [emotion, setEmotion] = useState("");
  const router = useRouter();

  const emotions = [
    { icon: "😊", label: "기쁨" },
    { icon: "😢", label: "슬픔" },
    { icon: "😡", label: "분노" },
    { icon: "😨", label: "불안" },
    { icon: "🥹", label: "감동" },
    { icon: "🤔", label: "생각" },
  ];

  const todayText = new Date().toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "long",
  });

  const saveDiaryToFirestore = async () => {
    const user = auth.currentUser;
    if (!user) {
      alert("로그인이 필요해요!");
      router.push("/login");
      return;
    }

    const today = new Date().toISOString().split("T")[0];
    const diaryRef = doc(db, "users", user.uid, "diaries", today);

    try {
      await setDoc(diaryRef, {
        entry,
        emotion,
        createdAt: new Date(),
      });
      setSubmitted(true);
    } catch (err) {
      console.error("저장 실패:", err);
      alert("저장에 실패했어요. 다시 시도해 주세요.");
    }
  };

  return (
    <div className="min-h-screen px-4 py-6 sm:px-4 sm:ml-48 ml-0 bg-gradient-to-b from-pink-50 to-white">
      <motion.h1
        className="text-2xl sm:text-xl font-bold text-pink-600 mb-6 text-center"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Today
      </motion.h1>

      <AnimatePresence>
        {!submitted ? (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full max-w-md mx-auto p-4 shadow-lg rounded-2xl bg-white"
          >
            <p className="text-base sm:text-sm text-gray-700 mb-2 text-center">{todayText}</p>

            <div className="flex justify-center gap-3 mb-4">
              {emotions.map((emo) => (
                <button
                  key={emo.label}
                  onClick={() => setEmotion(emo.icon)}
                  className={`text-2xl ${emotion === emo.icon ? "scale-125" : "opacity-50"}`}
                >
                  {emo.icon}
                </button>
              ))}
            </div>

            <textarea
              value={entry}
              onChange={(e) => setEntry(e.target.value)}
              placeholder="Remain me"
              className="w-full p-2 border rounded-lg text-sm min-h-[120px] placeholder-gray-600"
            />

            <button
              onClick={saveDiaryToFirestore}
              className="mt-4 w-full bg-pink-200 text-white py-2 rounded-lg hover:bg-pink-300 text-sm"
            >
              저장하기
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="submitted"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center mt-6 text-gray-700 w-full max-w-md mx-auto"
          >
            <div className="text-xl sm:text-2xl text-pink-500 font-semibold mb-4">
              이 순간을, 기억할게요.
            </div>

            <button
              onClick={() => {
                setSubmitted(false);
                setEntry("");
                setEmotion("");
              }}
              className="mt-2 w-full bg-gray-400 text-white py-2 rounded-lg hover:bg-gray-500 text-sm"
            >
              ← 다시 작성하기
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
