'use client';

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";


export default function WritePage() {
  const [entry, setEntry] = useState("");
  const [emotion, setEmotion] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [history, setHistory] = useState<{ date: string; entry: string; emotion: string }[]>([]);
  const [todayText, setTodayText] = useState("");

  useEffect(() => {
    const savedEntry = localStorage.getItem("today-entry");
    const savedEmotion = localStorage.getItem("today-emotion");
    const savedHistory = localStorage.getItem("entry-history");
    if (savedEntry && savedEntry.trim() !== "") {
      setEntry(savedEntry);
      setEmotion(savedEmotion || "");
      setSubmitted(true);
    }
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }

    const now = new Date();
    const days = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
    const todayStr = `${now.getFullYear()}년 ${String(now.getMonth() + 1).padStart(2, '0')}월 ${String(now.getDate()).padStart(2, '0')}일 ${days[now.getDay()]}`;
    setTodayText(todayStr);
  }, []);

  useEffect(() => {
    if (submitted) {
      const today = new Date().toLocaleDateString();
      const isAlreadySaved = history.some(h => h.date === today && h.entry === entry);
  
      if (!isAlreadySaved) {
        const newRecord = { date: today, entry, emotion };
        const updatedHistory = [newRecord, ...history];
        localStorage.setItem("today-entry", entry);
        localStorage.setItem("today-emotion", emotion);
        localStorage.setItem("entry-history", JSON.stringify(updatedHistory));
        setHistory(updatedHistory);
      }
    }
  }, [entry, emotion, submitted]);
  

  const emotions = [
    { icon: "😊", label: "기쁨" },
    { icon: "😢", label: "슬픔" },
    { icon: "😠", label: "화남" },
    { icon: "😶", label: "무표정" },
  ];

  return (
    <div className="flex flex-col items-center p-4 sm:p-6 min-h-screen bg-gradient-to-b from-pink-100 to-green-100">
      <motion.h1
        className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 text-center"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        오늘의 나 쓰기
      </motion.h1>

      {!submitted ? (
        <div className="w-full max-w-md p-4 sm:p-6 shadow-lg rounded-2xl bg-white">
          <p className="text-base sm:text-lg text-gray-600 mb-2 text-center">{todayText}</p>
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
            className="w-full p-2 border rounded-lg text-sm min-h-[120px]"
          />
          <button
            onClick={() => {
              if (entry.trim() !== "") {
                setSubmitted(true);
              }
            }}
            className="mt-4 w-full bg-pink-200 text-white py-2 rounded-lg hover:bg-pink-300 text-sm"
          >
            저장하기
          </button>
        </div>
      ) : (
        <div className="text-center mt-6 text-gray-700 w-full max-w-md">
          기록이 저장되었습니다! ✨
          <div className="text-2xl mt-2">오늘의 감정: {emotion || "(선택 안됨)"}</div>
          <button
            onClick={() => {
              setSubmitted(false);
              setEntry("");
              setEmotion("");
            }}
            className="mt-4 w-full bg-gray-400 text-white py-2 rounded-lg hover:bg-gray-500 text-sm"
          >
            ← 다시 작성하기
          </button>
          <Link href="/">
  <button className="mt-2 w-full bg-gray-400 text-white py-2 rounded-lg hover:bg-gray-500 text-sm">
    ← 홈으로 돌아가기
  </button>
</Link>

          <div className="mt-6 text-left">
            <h2 className="text-base font-semibold mb-2">📘 지난 일기</h2>
            <ul className="space-y-2">
              {history.map((item, idx) => (
                <li key={idx} className="bg-white p-3 rounded-xl shadow text-left">
                  <div className="text-xs text-gray-500">{item.date}</div>
                  <div className="text-base">{item.emotion} {item.entry.slice(0, 40)}...</div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
