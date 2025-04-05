"use client";

import { auth } from "@/lib/firebase";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Typewriter } from "react-simple-typewriter";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [fade, setFade] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsLoggedIn(!!user);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // 타이핑된 문구가 4초 후 사라짐
    const timer = setTimeout(() => {
      setFade(true);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center bg-gradient-to-b from-pink-100 to-white text-gray-800 px-6">
      <h1 className="text-6xl sm:text-7xl font-pacifico text-pink-700 mb-4">
        Rema in me
      </h1>

      {/* 👇 애니메이션 문구 + 페이드아웃 효과 */}
      <p
        className={`text-lg sm:text-xl text-gray-600 h-12 mb-10 transition-opacity duration-4000 ${
          fade ? "opacity-0" : "opacity-100"
        }`}
      >
        <Typewriter
          words={["아름답고 눈부신, 오늘이 사라지기 전에"]}
          loop={true}
          cursor
          cursorStyle="_"
          typeSpeed={110}
          deleteSpeed={0}
          delaySpeed={1000}
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
    </div>
  );
}
