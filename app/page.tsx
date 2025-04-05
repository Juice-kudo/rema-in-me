"use client";

import { auth } from "@/lib/firebase";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Typewriter } from "react-simple-typewriter";
import InstallPrompt from "./components/InstallPrompt"; // 👈 PWA 설치 버튼

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
    <div className="min-h-screen flex flex-col items-center justify-center text-center bg-gradient-to-b from-pink-100 to-white text-gray-800 px-6 relative">
      <h1 className="text-6xl sm:text-7xl font-pacifico text-pink-700 mb-4">
        Rema in me
      </h1>

      {/* 🌸 애니메이션 문구만 유지 */}
      <p className="text-lg sm:text-xl text-gray-600 h-12 mb-10">
        <Typewriter
          words={["아름답고 눈부신, 오늘이 사라지기 전에"]}
          loop={false}
          cursor
          cursorStyle="_"
          typeSpeed={110}
          deleteSpeed={0}
          delaySpeed={5000}
        />
      </p>

      {isLoggedIn ? (
        <button
          onClick={() => router.push("/write")}
          className="px-6 py-2 bg-pink-300 text-white rounded-full hover:bg-pink-400 shadow"
        >
          기록하러 가기
        </button>
      ) : (
        <div className="flex gap-4">
          <button
            onClick={() => router.push("/login")}
            className="px-6 py-2 bg-pink-300 text-white rounded-full hover:bg-pink-400 shadow text-sm"
          >
            로그인
          </button>
          <button
            onClick={() => router.push("/signup")}
            className="px-6 py-2 bg-white border border-pink-300 text-pink-600 rounded-full hover:bg-pink-100 shadow text-sm"
          >
            회원가입
          </button>
        </div>
      )}

      {/* PWA 설치 버튼 */}
      <InstallPrompt />
    </div>
  );
}
