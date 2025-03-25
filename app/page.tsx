'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-pink-100 flex flex-col justify-center items-center text-center p-6">
      <h1 className="text-4xl font-bold text-pink-600 mb-4 tracking-wide">
        Rema in me
      </h1>
      <p className="text-gray-700 mb-6 text-sm">
        감정과 가치관을 기록하고, 미래의 나와 대화하세요.
      </p>

      <div className="w-full max-w-xs flex flex-col gap-3">
        {isLoggedIn ? (
          <Link href="/write">
            <button className="w-full bg-pink-400 text-white py-2 rounded-xl text-sm hover:bg-pink-500">
              나의 감정을 기록하러 가기
            </button>
          </Link>
        ) : (
          <>
            <Link href="/login">
              <button className="w-full bg-white text-pink-500 border border-pink-300 py-2 rounded-xl text-sm hover:bg-pink-50">
                로그인
              </button>
            </Link>
            <Link href="/signup">
              <button className="w-full bg-pink-200 text-white py-2 rounded-xl text-sm hover:bg-pink-300">
                회원가입
              </button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
