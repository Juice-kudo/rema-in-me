"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { auth, db } from "@/lib/firebase";
import {
  doc,
  setDoc,
  getDocs,
  collection,
} from "firebase/firestore";

export default function WritePage() {
  const [entry, setEntry] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [emotion, setEmotion] = useState("");
  const [history, setHistory] = useState<any[]>([]);
  const [chatActive, setChatActive] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
  const [isSending, setIsSending] = useState(false);
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

  // ✅ fetchHistory 바깥으로 꺼내기
  const fetchHistory = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const diaryRef = collection(db, "users", user.uid, "diaries");
    const snapshot = await getDocs(diaryRef);

    const fetched = snapshot.docs.map((doc) => ({
      date: doc.id,
      ...doc.data(),
    }));

    setHistory(fetched);
  };

  useEffect(() => {
    fetchHistory();
  }, []);

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

      await fetchHistory(); // ✅ 저장 후 다시 불러오기
      setSubmitted(true);
    } catch (err) {
      console.error("저장 실패:", err);
      alert("저장에 실패했어요. 다시 시도해 주세요.");
    }
  };

  const handleChatSubmit = async () => {
    if (!input.trim()) return;

    const userMsg = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsSending(true);

    const diarySummary = history.map(item => {
      return `날짜: ${item.date}, 감정: ${item.emotion}, 내용: ${item.entry.slice(0, 50)}...`;
    }).join("\n");

    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: `
당신은 사용자의 과거 일기 데이터를 바탕으로 만들어진 '과거의 나'입니다.
다음은 과거의 일기 요약입니다:
${diarySummary}

위 내용을 기반으로 사용자의 감정과 가치관을 이해하고,
과거의 나처럼 감성적이고 솔직한 말투로 대화해 주세요.
              `.trim()
            },
            { role: "user", content: input },
          ],
        }),
      });

      const data = await res.json();
      const reply = data.choices?.[0]?.message?.content ?? "응답을 이해할 수 없어요.";
      setMessages((prev) => [...prev, { sender: "bot", text: reply }]);
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "죄송해요, 응답에 문제가 생겼어요." },
      ]);
    }

    setIsSending(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-6 bg-gradient-to-b from-pink-100 to-green-100">
      <motion.h1
        className="text-3xl font-bold text-gray-800 mb-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        오늘의 나를 기록하기
      </motion.h1>

      {!chatActive ? (
        !submitted ? (
          <div className="w-full max-w-md p-4 shadow-lg rounded-2xl bg-white">
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
              onClick={saveDiaryToFirestore}
              className="mt-4 w-full bg-pink-200 text-white py-2 rounded-lg hover:bg-pink-300 text-sm"
            >
              저장하기
            </button>

            <button
              onClick={() => setChatActive(true)}
              className="mt-2 w-full bg-blue-200 text-white py-2 rounded-lg hover:bg-blue-300 text-sm"
            >
              과거의 나와 대화하기
            </button>
          </div>
        ) : (
          <div className="text-center mt-6 text-gray-700 w-full max-w-md">
            기록이 저장되었습니다! ✨
            <div className="text-2xl mt-2">오늘의 감정: {emotion || "(선택 안됨)"}</div>
            <button
              onClick={() => setChatActive(true)}
              className="mt-4 w-full bg-blue-400 text-white py-2 rounded-lg hover:bg-blue-500 text-sm"
            >
              과거의 나와 대화하기
            </button>
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

            <div className="mt-6 text-left">
              <h2 className="text-base font-semibold mb-2">📘 지난 일기</h2>
              <ul className="space-y-2">
                {history.map((item, idx) => (
                  <li key={idx} className="bg-white p-3 rounded-xl shadow text-left">
                    <div className="text-xs text-gray-500">{item.date}</div>
                    <div className="text-base">
                      {item.emotion} {item.entry.slice(0, 40)}...
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )
      ) : (
        <div className="w-full max-w-md p-4 sm:p-6 shadow-lg rounded-2xl bg-white/90 backdrop-blur-sm">
          <p className="text-lg text-pink-600 font-semibold mb-3 text-center">
            과거의 나와 대화하기
          </p>
          <div className="h-64 overflow-y-auto border border-pink-100 p-3 rounded-xl bg-pink-50 text-sm space-y-2">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                <span className={`inline-block px-4 py-2 rounded-2xl max-w-[75%] whitespace-pre-wrap break-words shadow-md ${msg.sender === "user" ? "bg-pink-300 text-white" : "bg-white text-gray-700"}`}>
                  {msg.text}
                </span>
              </div>
            ))}
          </div>

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="과거의 나에게 질문해보세요..."
            className="w-full p-3 border border-pink-200 rounded-xl mt-3 text-sm min-h-[80px] placeholder-pink-300"
          />
          <button
            onClick={handleChatSubmit}
            disabled={isSending}
            className="mt-3 w-full bg-pink-400 text-white py-2 rounded-xl hover:bg-pink-500 disabled:opacity-50 text-sm"
          >
            전송
          </button>
          <button
            onClick={() => setChatActive(false)}
            className="mt-2 w-full text-pink-500 underline text-sm hover:text-pink-600"
          >
            ← 돌아가기
          </button>
        </div>
      )}
    </div>
  );
}
