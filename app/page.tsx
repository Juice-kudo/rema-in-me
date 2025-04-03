"use client";
import { auth } from "@/lib/firebase";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsLoggedIn(!!user);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center bg-pink-100 text-gray-800">
      <h1 className="text-4xl font-dancing text-pink-700">rema in me</h1>
      <p className="mb-6">나의 겉모습이 아닌, 내면을 남겨보세요.</p>

      {isLoggedIn ? (
        <button
          onClick={() => router.push("/write")}
          className="px-6 py-2 bg-pink-300 text-white rounded-lg hover:bg-pink-400"
        >
          기록하러 가기
        </button>
      ) : (
        <div className="flex gap-4">
          <button
            onClick={() => router.push("/login")}
            className="px-6 py-2 bg-pink-200 text-white rounded-lg hover:bg-pink-300"
          >
            로그인
          </button>
          <button
            onClick={() => router.push("/signup")}
            className="px-6 py-2 bg-gray-200 text-pink-700 rounded-lg hover:bg-gray-300"
          >
            회원가입
          </button>
        </div>
      )}
    </div>
  );
}
