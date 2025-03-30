"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 bg-gradient-to-b from-pink-100 to-white sm:ml-0 ml-48">
      <h1 className="text-5xl sm:text-4xl font-[Dancing Script] text-pink-600 mb-8">
        Rema in me
      </h1>

      <p className="text-gray-600 text-base sm:text-sm mb-10 max-w-md">
        감정과 가치관을 기록하고,  
        나중에 과거의 나와 다시 마주해보세요.
      </p>

      <div className="flex flex-col gap-4 w-full max-w-xs">
        <button
          onClick={() => router.push("/write")}
          className="bg-pink-300 hover:bg-pink-400 text-white py-2 px-4 rounded-lg text-sm"
        >
          ✏️ 오늘의 나를 기록하기
        </button>
        <button
          onClick={() => router.push("/chat")}
          className="bg-blue-300 hover:bg-blue-400 text-white py-2 px-4 rounded-lg text-sm"
        >
          💬 과거의 나와 대화하기
        </button>
        <button
          onClick={() => router.push("/history")}
          className="bg-green-300 hover:bg-green-400 text-white py-2 px-4 rounded-lg text-sm"
        >
          📘 지난 일기 보기
        </button>
      </div>
    </div>
  );
}
