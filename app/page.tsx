'use client';

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Home() {
  const [entry, setEntry] = useState("");
  const [emotion, setEmotion] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [chatActive, setChatActive] = useState(false);
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
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
      const newRecord = { date: today, entry, emotion };
      const updatedHistory = [newRecord, ...history];
      localStorage.setItem("today-entry", entry);
      localStorage.setItem("today-emotion", emotion);
      localStorage.setItem("entry-history", JSON.stringify(updatedHistory));
      setHistory(updatedHistory);
    }
  }, [entry, emotion, submitted]);

  const handleChatSubmit = async () => {
    if (input.trim() === "" || isSending) return;
    setIsSending(true);
    setMessages(prev => [...prev, { sender: "user", text: input }]);

    const historyPrompt = history
      .map(item => `📅 ${item.date} ${item.emotion} - ${item.entry}`)
      .join("\n");

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: `너는 사용자의 감정일기를 기반으로 조언을 주는 감성적인 챗봇이야. 아래는 지금까지의 일기 내용이야.\n\n${historyPrompt}`,
            },
            { role: "user", content: input },
          ],
          temperature: 0.7,
        }),
      });

      const data = await response.json();
      if (data.choices && data.choices.length > 0) {
        const botReply = data.choices[0].message?.content || "답변 없음";
        setMessages(prev => [...prev, { sender: "bot", text: botReply }]);
      } else {
        setMessages(prev => [...prev, { sender: "bot", text: "응답 형식이 예상과 달라요." }]);
      }
    } catch (error) {
      console.error("❌ OpenAI 요청 에러:", error);
      setMessages(prev => [...prev, { sender: "bot", text: "죄송해요, 응답을 받을 수 없어요." }]);
    }
    setIsSending(false);
    setInput("");
  };

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
        Rema in me
      </motion.h1>

      {!chatActive ? (
        !submitted ? (
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
                    <div className="text-base">{item.emotion} {item.entry.slice(0, 40)}...</div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )
      ) : (
        <div className="w-full max-w-md p-4 sm:p-6 shadow-lg rounded-2xl bg-white">
          <p className="text-base sm:text-lg text-gray-600 mb-2 text-center">과거의 나와 대화하기</p>
          <div className="h-64 overflow-y-auto border p-2 rounded-lg bg-gray-100 text-sm">
            {messages.map((msg, i) => (
              <div key={i} className={`mb-2 ${msg.sender === "user" ? "text-right" : "text-left"}`}>
                <span className={`inline-block px-3 py-1 rounded-lg ${msg.sender === "user" ? "bg-pink-300 text-white" : "bg-gray-300 text-black"}`}>
                  {msg.text}
                </span>
              </div>
            ))}
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="과거의 나에게 질문해보세요..."
            className="w-full p-2 border rounded-lg mt-2 text-sm min-h-[80px]"
          />
          <button
            onClick={handleChatSubmit}
            disabled={isSending}
            className="mt-2 w-full bg-blue-400 text-white py-2 rounded-lg hover:bg-blue-500 disabled:opacity-50 text-sm"
          >
            전송
          </button>
          <button
            onClick={() => setChatActive(false)}
            className="mt-2 w-full bg-gray-400 text-white py-2 rounded-lg hover:bg-gray-500 text-sm"
          >
            뒤로 가기
          </button>
        </div>
      )}
    </div>
  );
}
