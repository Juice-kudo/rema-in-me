"use client";

import { useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function ChatPage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [historyData, setHistoryData] = useState<any[]>([]);

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

  const handleChatSubmit = async () => {
    if (!input.trim()) return;

    setMessages([...messages, { sender: "user", text: input }]);
    setIsSending(true);

    const systemPrompt = `
너는 사용자의 과거 모습, 즉 '과거의 나' 역할을 해야 해.
사용자의 일기 데이터를 기반으로 그 사람의 말투, 감정 표현, 성격, 가치관을 이해하고
현재 사용자와 대화하되, 마치 과거의 내가 다시 살아나 이야기하듯 자연스럽게 말해줘.
사용자는 네가 자신임을 알고 있기 때문에, 굳이 설명하지 말고 편하게 '과거의 나'처럼 말해.
과거의 생각이나 느낌이 지금과 다르더라도, 네 기준에서 말해도 돼.

다음은 사용자의 과거 일기들이야:
${historyData.map((d) => `${d.date}: (${d.emotion}) ${d.entry}`).join("\n")}
    `;

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: input },
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
      <h1 className="text-2xl sm:text-xl font-bold text-pink-700 mb-4 text-center">
        💬 과거의 나와 대화하기
      </h1>

      <div className="w-full max-w-md mx-auto p-4 bg-white rounded-2xl shadow">
        <div className="h-64 overflow-y-auto border p-2 rounded-lg bg-gray-50 text-sm sm:text-base">
          {messages.map((msg, i) => (
            <div key={i} className={`mb-2 ${msg.sender === "user" ? "text-right" : "text-left"}`}>
              <span
                className={`inline-block px-3 py-2 rounded-lg max-w-[80%] ${
                  msg.sender === "user"
                    ? "bg-pink-300 text-white"
                    : "bg-gray-300 text-black"
                }`}
              >
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
      </div>
    </div>
  );
}
