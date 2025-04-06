"use client";

import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "@/styles/custom-calendar.css"; // 색상 정의한 CSS

import { auth, db } from "@/lib/firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";

export default function HistoryPage() {
  const [diaries, setDiaries] = useState<{ [key: string]: string }>({});
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedDiary, setSelectedDiary] = useState<{ entry: string; emotion: string } | null>(null);

  useEffect(() => {
    const fetchDiaries = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const snapshot = await getDocs(collection(db, "users", user.uid, "diaries"));
      const data: { [key: string]: string } = {};
      snapshot.forEach((doc) => {
        const { emotion } = doc.data();
        data[doc.id] = emotion || "";
      });

      setDiaries(data);
    };

    fetchDiaries();
  }, []);

  const handleDateClick = async (date: Date) => {
    const user = auth.currentUser;
    if (!user) return;

    const dateStr = date.toISOString().split("T")[0];
    setSelectedDate(date);

    const diaryRef = doc(db, "users", user.uid, "diaries", dateStr);
    const diarySnap = await getDoc(diaryRef);

    if (diarySnap.exists()) {
      const { entry, emotion } = diarySnap.data();
      setSelectedDiary({ entry, emotion });
    } else {
      setSelectedDiary(null);
    }
  };

  const emotionToLevel = (emo: string) => {
    switch (emo) {
      case "😊": return "level-5";
      case "🥹": return "level-4";
      case "🤔": return "level-3";
      case "😢": return "level-2";
      case "😨":
      case "😡": return "level-1";
      default: return "";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white px-4 sm:px-6 sm:ml-48 ml-0 py-10 text-center">
      <h1 className="text-2xl sm:text-xl font-bold text-pink-600 mb-6 font-pacifico">
        Diary
      </h1>

      <div className="max-w-md mx-auto bg-white shadow-md rounded-2xl p-4">
        <Calendar
          locale="en"
          onClickDay={handleDateClick}
          tileClassName={({ date }) => {
            const dateStr = date.toISOString().split("T")[0];
            const emotion = diaries[dateStr];
            return emotionToLevel(emotion);
          }}
        />
      </div>

      {selectedDiary && selectedDate && (
        <div className="mt-6 max-w-md mx-auto p-4 bg-white/80 backdrop-blur rounded-xl shadow text-left text-sm break-words whitespace-pre-wrap">
          <div className="text-pink-500 font-bold mb-2">
            📅 {selectedDate.toLocaleDateString("ko-KR")}
          </div>
          <div className="text-xl mb-2">{selectedDiary.emotion}</div>
          <div className="text-gray-700 whitespace-pre-wrap break-words text-sm leading-relaxed">
            {selectedDiary.entry}
          </div>

        </div>
      )}
    </div>
  );
}
