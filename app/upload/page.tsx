"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { parseKakaoChat, ChatMessage } from "@/lib/kakaoParser";

export default function UploadPage() {
  const [chatText, setChatText] = useState("");
  const [parsedMessages, setParsedMessages] = useState<ChatMessage[]>([]);
  const [fileName, setFileName] = useState("");
  const [myName, setMyName] = useState("이름입력");
  const [otherPerson, setOtherPerson] = useState("");
  const router = useRouter();

  const extractOtherPerson = (messages: ChatMessage[], myName: string): string | null => {
    const senderCounts: Record<string, number> = {};

    messages.forEach((msg) => {
      if (msg.sender !== myName) {
        senderCounts[msg.sender] = (senderCounts[msg.sender] || 0) + 1;
      }
    });

    const sorted = Object.entries(senderCounts).sort((a, b) => b[1] - a[1]);
    return sorted.length > 0 ? sorted[0][0] : null;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result as string;
      setChatText(text);

      const parsed = parseKakaoChat(text);
      setParsedMessages(parsed);

      const opponent = extractOtherPerson(parsed, myName);
      if (opponent) setOtherPerson(opponent);

      // ✅ 로컬스토리지에 저장
      localStorage.setItem("parsedMessages", JSON.stringify(parsed));
      localStorage.setItem("myName", myName);
      router.push("/talk");
    };

    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen px-6 py-12 sm:ml-48 ml-0 bg-gradient-to-b from-pink-50 to-white text-center">
      <h1 className="text-2xl font-bold text-pink-600 font-pacifico mb-6">
        그 사람과 나눴던 대화를 보내주세요.
      </h1>

      <div className="mb-4">
        <input
          type="text"
          placeholder="예시:이주원"
          value={myName}
          onChange={(e) => setMyName(e.target.value)}
          className="border p-2 rounded w-64 text-sm"
        />
      </div>

      <input
        type="file"
        accept=".txt"
        onChange={handleFileChange}
        className="mb-4"
      />

      {fileName && (
        <p className="text-sm text-gray-500 mb-2">📄 {fileName} 불러옴</p>
      )}

      {otherPerson && (
        <p className="text-sm text-pink-500 mb-4">
          💡 감지된 상대방 이름: <strong>{otherPerson}</strong>
        </p>
      )}

      {parsedMessages.length > 0 && (
        <div className="max-w-xl mx-auto bg-white p-4 rounded-lg shadow text-left text-sm text-gray-700">
          <h2 className="text-pink-500 font-semibold mb-2">🔍 파싱된 메시지 예시</h2>
          {parsedMessages.slice(0, 10).map((msg, idx) => (
            <div key={idx} className="mb-2">
              <div className="text-xs text-gray-500">
                {msg.date} {msg.time} - {msg.sender}
              </div>
              <div>{msg.message}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
