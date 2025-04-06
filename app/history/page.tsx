"use client";

import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "@/styles/custom-calendar.css"; // 직접 커스터마이징한 스타일

import { auth, db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function HistoryPage() {
  const [diaries, setDiaries] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchDiaries = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const snapshot = await getDocs(
        collection(db, "users", user.uid, "diaries")
      );

      const data: { [key: string]: string } = {};
      snapshot.forEach((doc) => {
        const { emotion } = doc.data();
        data[doc.id] = emotion || "";
      });

      setDiaries(data);
    };

    fetchDiaries();
  }, []);

  const emotionColor = (emo: string) => {
    switch (emo) {
      case "😊":
        return "#fbb6ce"; // 진한 핑크
      case "🥹":
        return "#fcd5e4";
      case "🤔":
        return "#fde2ef";
      case "😢":
        return "#fff0f5";
      case "😨":
      case "😡":
        return "#ffffff"; // 거의 흰색
      default:
        return "transparent";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white px-4 sm:px-6 sm:ml-48 ml-0 py-10 text-center">
      <h1 className="text-2xl sm:text-xl font-bold text-pink-600 mb-6 font-pacifico">
        Diary
      </h1>

      <div className="max-w-md mx-auto bg-white shadow-md rounded-2xl p-4">
        <Calendar
          locale="en-US"
          tileContent={({ date, view }) => {
            const dateStr = date.toISOString().split("T")[0];
            const emotion = diaries[dateStr];

            return (
              <div
                className="w-full h-full rounded-full"
                style={{
                  backgroundColor: emotionColor(emotion),
                  transition: "all 0.3s ease",
                  paddingTop: "10px",
                }}
              >
                <span className="text-xl">{emotion}</span>
              </div>
            );
          }}
        />
      </div>
    </div>
  );
}
