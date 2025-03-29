'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    signOut(auth);
  };

  return (
    <div className="min-h-screen bg-pink-100 flex flex-col justify-center items-center text-center p-6">
      <h1
        className="text-7xl mb-4 text-pink-600 tracking-wide"
        style={{ fontFamily: "'Dancing Script', cursive" }}
>
        Rema in me
      </h1>

      <p className="text-gray-700 mb-6 text-sm">
        나의 오늘, 오늘의 나를 솔직하게 남겨주세요.
      </p>

      <div className="w-full max-w-xs flex flex-col gap-3">
        {isLoggedIn ? (
          <>
            <Link href="/write">
              <button className="w-full bg-pink-400 text-white py-2 rounded-xl text-sm hover:bg-pink-500">
                나의 감정을 기록하러 가기
              </button>
            </Link>
            <button
              onClick={handleLogout}
              className="w-full text-gray-500 text-xs underline mt-1"
            >
              로그아웃
            </button>
          </>
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
