"use client";

import { useState, useEffect, useRef } from "react";
import { auth, db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function ChatPage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [historyData, setHistoryData] = useState<any[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const diaryRef = collection(db, "users", user.uid, "diaries");
      const snapshot = await getDocs(diaryRef);
      const fetched = snapshot.docs.map((doc) => ({
        date: doc.id,
        ...doc.data(),
      }));

      setHistoryData(fetched);
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleChatSubmit = async () => {
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { sender: "user", text: input }]);
    setIsSending(true);

    try {
      // 일기에서 자주 등장한 단어들 추출
      const keywordSamples = historyData
        .map((d) => d.entry)
        .join(" ")
        .split(" ")
        .filter((word) => word.length > 1);

      const keywordList = [...new Set(keywordSamples)].slice(0, 20).join(", ");

      const prompt = `
너는 단순한 감정 위로봇이 아니야.

너는 이 사용자의 오랜 가치관, 생각, 감정, 경험을 바탕으로
그 사람의 내면을 진심으로 이해하고,
그 사람의 과거가 현재의 나에게 건네는 진짜 이야기야.

너는 이 사용자의 '과거의 자아'로서 대화해야 해.

아래는 이 사용자의 과거 일기 기록이야:
${historyData.map((d) => `${d.date}: (${d.emotion}) ${d.entry}`).join("\n")}

이 사람은 다음과 같은 단어를 자주 사용해:
${keywordList}

너는 이 단어들과 말투를 참고해서, 가능한 한 이 사람처럼 말해.
지금부터 이 사용자의 과거 자아로 대답해 줘.

사용자의 질문: ${input}
`;

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
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
              content: "너는 사용자의 과거 자아로서, 감정과 가치관이 담긴 깊이 있는 대화를 나누는 챗봇이야.",
            },
            { role: "user", content: prompt },
          ],
        }),
      });

      const data = await response.json();
      const reply = data.choices?.[0]?.message?.content || "응답을 받을 수 없어요.";
      setMessages((prev) => [...prev, { sender: "bot", text: reply }]);
    } catch (err) {
      console.error("AI 응답 실패:", err);
      setMessages((prev) => [...prev, { sender: "bot", text: "죄송해요, 응답에 실패했어요." }]);
    } finally {
      setInput("");
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen px-4 py-6 sm:px-4 sm:ml-48 ml-0 bg-gradient-to-b from-pink-50 to-white">
      <h1 className="text-2xl sm:text-xl font-bold text-pink-700 mb-4 text-center font-dancing">
        💬 과거의 나와 대화하기
      </h1>

      <div className="w-full max-w-md mx-auto p-4 bg-white rounded-2xl shadow relative">
        <div className="h-[300px] sm:h-[400px] overflow-y-auto p-2 rounded-lg bg-gray-50 text-sm sm:text-base space-y-2">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[70%] px-4 py-2 rounded-2xl shadow text-sm sm:text-base whitespace-pre-wrap break-words
                ${msg.sender === "user" ? "bg-pink-200 text-white" : "bg-gray-200 text-gray-800"}`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="과거의 나에게 질문해보세요..."
          className="w-full p-2 mt-4 border border-pink-200 rounded-lg text-sm sm:text-base min-h-[80px] focus:outline-none focus:ring-2 focus:ring-pink-200"
        />

        <button
          onClick={handleChatSubmit}
          disabled={isSending}
          className="mt-2 w-full bg-pink-400 text-white py-2 rounded-lg hover:bg-pink-500 disabled:opacity-50 text-sm sm:text-base"
        >
          전송
        </button>
      </div>
    </div>
  );
}
