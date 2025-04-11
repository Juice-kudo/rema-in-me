// app/chatUpload/page.tsx
"use client";

import { useState } from "react";

export default function ChatUpload() {
  const [messages, setMessages] = useState<
    { date: string; sender: string; text: string }[]
  >([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split("\n");
      const parsed = parseChat(lines);
      setMessages(parsed);
    };
    reader.readAsText(file);
  };

  const parseChat = (lines: string[]) => {
    const result: { date: string; sender: string; text: string }[] = [];
    let currentDate = "";

    for (let line of lines) {
      line = line.trim();
      const dateMatch = line.match(/^(\d{4})년 (\d{1,2})월 (\d{1,2})일/);
      if (dateMatch) {
        currentDate = line;
        continue;
      }

      const msgMatch = line.match(/^(.+?): (.+)$/);
      if (msgMatch) {
        const sender = msgMatch[1];
        const text = msgMatch[2];
        result.push({ date: currentDate, sender, text });
      }
    }

    return result;
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white shadow rounded-2xl mt-10">
      <h1 className="text-2xl font-pacifico text-pink-600 mb-4 text-center">💌 카카오톡 대화 업로드</h1>

      <input
        type="file"
        accept=".txt"
        onChange={handleFileChange}
        className="mb-4"
      />

      {messages.length > 0 && (
        <div className="mt-4 text-sm max-h-60 overflow-y-auto whitespace-pre-wrap border p-2 rounded-md bg-pink-50">
          {messages.map((m, idx) => (
            <div key={idx}>
              <strong>{m.sender}</strong>: {m.text}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
