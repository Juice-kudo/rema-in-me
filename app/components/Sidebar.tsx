'use client';

import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function Sidebar() {
  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.href = '/login';
    } catch (err) {
      console.error('로그아웃 실패:', err);
    }
  };

  return (
    <nav className="fixed left-0 top-0 h-full w-48 bg-pink-100 shadow-md flex flex-col items-start p-4 space-y-4 z-50">
      <a href="/" className="text-lg font-bold text-pink-700 hover:underline">Home</a>
      <a href="/write" className="text-md text-gray-700 hover:underline">✍️ 오늘의 나</a>
      <a href="/history" className="text-md text-gray-700 hover:underline">📘 지난 일기</a>
      <a href="/chat" className="text-md text-gray-700 hover:underline">💬 대화하기</a>
      <a href="/login" className="text-md text-gray-700 hover:underline">🔐 로그인</a>
      <a href="/signup" className="text-md text-gray-700 hover:underline">🧾 회원가입</a>
      <button
        onClick={handleLogout}
        className="text-md text-red-500 hover:underline mt-4"
      >
        🚪 로그아웃
      </button>
    </nav>
  );
}
