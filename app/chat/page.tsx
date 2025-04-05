"use client";

import { useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import { collection, getDocs, doc, setDoc } from "firebase/firestore";

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

    const newMessages = [...messages, { sender: "user", text: input }];
    setMessages(newMessages);
    setIsSending(true);

    const systemPrompt = historyData.length > 0
    ? `
  너는 사용자의 '과거의 나' 역할이야.
  
  너는 사용자가 썼던 일기들을 통해 말투, 감정 표현, 가치관, 삶의 시선을 학습했어.
  이제 너는 그 과거의 '나'처럼, 현재의 사용자와 대화해야 해.
  
  - 사용자의 말에 공감하거나 단순 위로만 하지 말고, 실제 과거의 내가 생각할 법한 말투와 가치관으로 대답해.
  - 필요하면 예전에 했던 말, 감정, 생각을 회상하듯 말해도 좋아.
  - 예의 없이 막말하거나 조롱하지 말고, 진솔하고 자연스럽게, 인간적인 말투를 유지해.
  
  다음은 사용자의 과거 일기들이야:
  ${historyData.map((d) => `${d.date}: (${d.emotion}) ${d.entry}`).join("\n")}
    `
    : `
  너는 사용자의 '과거의 나' 역할이야.
  
  아직 이 사용자에 대한 일기 정보는 없지만,
  너는 부드럽고 감성적인 대화를 시작할 수 있어.
  너는 사용자의 과거에 대해서 알고있는게 없으니까, 사용자의 오늘에 대해서 물어보는게 좋을거같아.
  
  기억은 없지만 마음은 연결돼 있는 느낌으로, 가볍고 따뜻하게 대화를 시작해.
  하지만 사용자는 네가 사용자에 대해서 잘 알지 못하는 것도 이미 알고있고, 충분히 인지하고 있으니까 연기하지는 말고. 
  편한 대화를 유도해줘.
  `;
  

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: input },
          ],
        }),
      });

      const data = await response.json();
      const reply = data.choices?.[0]?.message?.content || "응답을 받을 수 없어요.";
      const allMessages = [...newMessages, { sender: "bot", text: reply }];
      setMessages(allMessages);

      const user = auth.currentUser;
      if (user) {
        const today = new Date().toISOString().split("T")[0];
        const chatRef = doc(db, "users", user.uid, "chats", today);
        await setDoc(chatRef, { messages: allMessages }, { merge: true });
      }
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
      <h1 className="text-2xl sm:text-xl font-bold text-pink-600 mb-6 text-center">
        To be you
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
          placeholder="오늘의 나를 남겨주세요"
          className="w-full p-2 border rounded-lg mt-2 text-sm min-h-[80px]"
        />

        <button
          onClick={handleChatSubmit}
          disabled={isSending}
          className="mt-2 w-full bg-pink-400 text-white py-2 rounded-lg hover:bg-blue-500 disabled:opacity-50 text-sm"
        >
          전송
        </button>
      </div>
    </div>
  );
}
