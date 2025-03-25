'use client';

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";


export default function ChatPage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [history, setHistory] = useState<{ date: string; entry: string; emotion: string }[]>([]);

  useEffect(() => {
    const savedHistory = localStorage.getItem("entry-history");
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

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

  return (
    <div className="flex flex-col items-center p-4 sm:p-6 min-h-screen bg-gradient-to-b from-pink-100 to-green-100">
      <motion.h1
        className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 text-center"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        과거의 나와 대화하기
      </motion.h1>

      <div className="w-full max-w-md p-4 sm:p-6 shadow-lg rounded-2xl bg-white">
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
        <Link href="/">
  <button className="mt-4 w-full bg-gray-400 text-white py-2 rounded-lg hover:bg-gray-500 text-sm">
    ← 홈으로 돌아가기
  </button>
</Link>

      </div>
    </div>
  );
}
