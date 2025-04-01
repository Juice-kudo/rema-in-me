"use client";

import { useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const diaryEntries = [
  { date: "2025-02-01", entry: "오늘은 햇살이 유난히 따뜻했다...", emotion: "😊" },
  { date: "2025-02-02", entry: "회사에서 작은 실수를 했다...", emotion: "😢" },
  { date: "2025-02-03", entry: "갑자기 보고 싶은 사람이 생겼다...", emotion: "🥹" },
  { date: "2025-02-04", entry: "오랜만에 혼자 영화를 봤다...", emotion: "😢" },
  { date: "2025-02-05", entry: "비가 내렸다...", emotion: "🤔" },
  { date: "2025-02-06", entry: "친구랑 카페에서 오래 이야기했다...", emotion: "😊" },
  { date: "2025-02-07", entry: "나를 위한 시간을 보냈다...", emotion: "🤔" },
  { date: "2025-02-08", entry: "엄마한테 안부 전화를 했다...", emotion: "🥹" },
  { date: "2025-02-09", entry: "불안한 꿈을 꿨다...", emotion: "😨" },
  { date: "2025-02-10", entry: "거울 속 내가 낯설게 느껴졌다...", emotion: "😢" },
  { date: "2025-02-11", entry: "오랜만에 운동을 했다...", emotion: "😊" },
  { date: "2025-02-12", entry: "좋아하는 노래를 들으며 버스를 탔다...", emotion: "😊" },
  { date: "2025-02-13", entry: "뭔가 잘못하고 있는 것 같은 기분이 들었다...", emotion: "😨" },
  { date: "2025-02-14", entry: "밸런타인데이였다...", emotion: "🥹" },
  { date: "2025-02-15", entry: "갑자기 울컥한 하루였다...", emotion: "😢" },
  { date: "2025-02-16", entry: "혼자 밤길을 걷다가 하늘을 봤다...", emotion: "🤔" },
  { date: "2025-02-17", entry: "새로운 다이어리를 샀다...", emotion: "😊" },
  { date: "2025-02-18", entry: "SNS를 지웠다...", emotion: "😡" },
  { date: "2025-02-19", entry: "일이 손에 안 잡혔다...", emotion: "😢" },
  { date: "2025-02-20", entry: "무기력했다...", emotion: "😨" },
  { date: "2025-02-21", entry: "산책 중 고양이를 봤다...", emotion: "😊" },
  { date: "2025-02-22", entry: "새벽까지 잠이 오지 않았다...", emotion: "😢" },
  { date: "2025-02-23", entry: "일기를 쓰고 있다...", emotion: "🥹" },
  { date: "2025-02-24", entry: "사소한 일에 짜증이 났다...", emotion: "😡" },
  { date: "2025-02-25", entry: "마음이 꽉 막힌 기분이었다...", emotion: "😨" },
  { date: "2025-02-26", entry: "낯선 사람의 따뜻한 말 한마디가 유난히 크게 느껴졌다...", emotion: "😊" },
  { date: "2025-02-27", entry: "작은 성취가 있었다...", emotion: "😊" },
  { date: "2025-02-28", entry: "봄이 오려는지 바람이 달라졌다...", emotion: "🤔" },
  { date: "2025-02-29", entry: "2월의 마지막 날. 한 달을 돌아보며 일기를 쓴다...", emotion: "🥹" },
];

export default function SeedPage() {
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        alert("로그인이 필요합니다");
        return;
      }

      for (const diary of diaryEntries) {
        const diaryRef = doc(db, "users", user.uid, "diaries", diary.date);
        await setDoc(diaryRef, {
          entry: diary.entry,
          emotion: diary.emotion,
          createdAt: new Date(`${diary.date}T12:00:00`),
        });
      }

      alert("샘플 일기 데이터가 모두 등록되었습니다!");
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center text-pink-600 text-lg font-dancing">
      ⏳ 샘플 일기 데이터를 업로드 중입니다...
    </div>
  );
}
