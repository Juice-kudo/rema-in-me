'use client';

import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-pink-100 to-pink-200 px-4 text-center">
      <motion.h1
        className="text-3xl sm:text-5xl font-bold text-pink-700 mb-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Remain me
      </motion.h1>

      <motion.p
        className="text-base sm:text-xl text-pink-600 mb-8 max-w-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 1 }}
      >
        사진이 아닌 감정으로, 말이 아닌 마음으로<br />
        오늘의 나를 남겨보세요.
      </motion.p>

      <motion.div
        className="flex flex-col gap-4 w-full max-w-xs"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 1 }}
      >
        <Link href="/write">
          <button className="w-full bg-pink-300 hover:bg-pink-400 text-white font-semibold py-3 rounded-2xl shadow">
            📖 오늘의 나 쓰기
          </button>
        </Link>
        <Link href="/chat">
          <button className="w-full bg-white hover:bg-pink-100 text-pink-500 font-semibold py-3 rounded-2xl shadow">
            💬 과거의 나와 대화하기
          </button>
        </Link>
      </motion.div>
    </div>
  );
}
