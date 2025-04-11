// app/chat-kakao/page.tsx

"use client";

import { useEffect, useState } from "react";
import { generateKakaoPrompt } from "@/lib/generateKakaoPrompt";
import { auth } from "@/lib/firebase";

export default function ChatKakaoPage() {
  const [messages, setMessages] = useState<{ sender: "user" | "bot"; text: string }[]>([]);
  const [input, setInput] = useState("");
  const [rawMessages, setRawMessages] = useState<any[]>([]); // 파싱된 메시지 (파일 업로드 후 저장된 것)
  const [userName, setUserName] = useState("나");
  const [partnerName, setPartnerName] = useState("상대");
  const [userNickname, setUserNickname] = useState("나");
  const [partnerNickname, setPartnerNickname] = useState("너");

  // 예시로 파싱된 데이터 불러오기 (이 부분은 실제 저장된 firestore 또는 localStorage에서 가져올 수 있음)
  useEffect(() => {
    const stored = localStorage.getItem("parsedKakaoMessages");
    if (stored) {
      const parsed = JSON.parse(stored);
      setRawMessages(parsed);
    }
  }, []);

  const handleSubmit = async () => {
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { sender: "user", text: input }]);

    const prompt = generateKakaoPrompt(rawMessages, userName, partnerName, userNickname, partnerNickname);

    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o", // 또는 gpt-3.5-turbo
          messages: [
            { role: "system", content: prompt },
            { role: "user", content: input },
          ],
        }),
      });

      const data = await res.json();
      const reply = data.choices?.[0]?.message?.content || "응답을 받을 수 없어요.";

      setMessages((prev) => [...prev, { sender: "bot", text: reply }]);
      setInput("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen px-4 py-6 sm:ml-48 ml-0 bg-gradient-to-b from-pink-50 to-white">
      <h1 className="text-2xl text-pink-600 font-pacifico mb-4 text-center">과거의 대화</h1>

      <div className="max-w-xl mx-auto bg-white p-4 rounded-lg shadow">
        <div className="h-64 overflow-y-auto border p-2 rounded bg-gray-50 text-sm mb-2">
          {messages.map((msg, i) => (
            <div key={i} className={`mb-2 ${msg.sender === "user" ? "text-right" : "text-left"}`}>
              <span
                className={`inline-block px-3 py-2 rounded-lg max-w-[80%] ${
                  msg.sender === "user" ? "bg-pink-300 text-white" : "bg-gray-300 text-black"
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
          placeholder="말을 걸어보세요..."
          className="w-full p-2 border rounded-lg text-sm min-h-[80px]"
        />

        <button
          onClick={handleSubmit}
          className="mt-2 w-full bg-pink-400 hover:bg-pink-500 text-white py-2 rounded-lg text-sm"
        >
          전송
        </button>
      </div>
    </div>
  );
}
