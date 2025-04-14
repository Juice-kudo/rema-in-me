"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getParsedMessages } from "@/lib/kakaoParser";

export default function TalkPage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const parsedMessages = getParsedMessages();
  const myName = typeof window !== "undefined" ? localStorage.getItem("myName") || "나" : "나";
  const router = useRouter();
  useEffect(() => {
    if (parsedMessages.length === 0) {
      router.push("/upload");
    }
  }, []);
  
  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { sender: "user", text: input }];
    setMessages(newMessages);
    setIsLoading(true);

    const partnerName = parsedMessages.find((m) => m.sender !== myName)?.sender || "상대방";

    try {
      const res = await fetch("/api/talk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({
            role: m.sender === "user" ? "user" : "assistant",
            content: m.text,
          })),
          exampleMessages: parsedMessages,
          userName: myName,
          partnerName: partnerName,
          userNickname: myName,
          partnerNickname: partnerName,
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("❌ 서버 응답 에러:", errorText);
        return;
      }

      const data = await res.json();
      setMessages((prev) => [...prev, { sender: "bot", text: data.reply }]);
    } catch (err) {
      console.error("대화 실패:", err);
    } finally {
      setInput("");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-4 py-8 sm:ml-48 ml-0 bg-gradient-to-b from-pink-50 to-white">
      <h1 className="text-2xl font-bold text-pink-600 mb-1 text-center font-pacifico">
        Talk Again
      </h1>
      <h2 className="text-sm text-center text-gray-500 mb-4">
        {parsedMessages.length > 0
          ? `${parsedMessages.find((m) => m.sender !== myName)?.sender || "상대방"}와의 대화`
          : ""}
      </h2>

      <div className="max-w-md mx-auto bg-white rounded-xl shadow p-4">
        <div className="h-64 overflow-y-auto mb-4 text-sm">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`mb-2 ${msg.sender === "user" ? "text-right" : "text-left"}`}
            >
              <span
                className={`inline-block px-3 py-2 rounded-lg max-w-[80%] ${
                  msg.sender === "user"
                    ? "bg-pink-300 text-white"
                    : "bg-gray-200 text-black"
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
          placeholder="하고 싶은 말을 적어보세요"
          className="w-full border rounded-lg p-2 text-sm min-h-[60px]"
        />

        <button
          onClick={handleSend}
          disabled={isLoading}
          className="mt-2 w-full bg-pink-400 text-white py-2 rounded-lg hover:bg-pink-500 disabled:opacity-50 text-sm"
        >
          {isLoading ? "응답 생성 중..." : "보내기"}
        </button>
      </div>
    </div>
  );
}
