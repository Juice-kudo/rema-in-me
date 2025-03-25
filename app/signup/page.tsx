'use client';

import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSignup = async () => {
    try {
      setError('');
      await createUserWithEmailAndPassword(auth, email, password);
      router.push('/write'); // 회원가입 성공 시 일기쓰기 페이지로 이동
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-pink-100 to-pink-200 p-4">
      <div className="bg-white p-6 rounded-2xl shadow max-w-sm w-full">
        <h1 className="text-2xl font-bold text-pink-600 mb-4 text-center">회원가입</h1>
        <input
          type="email"
          placeholder="이메일을 입력하세요"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-3 p-2 border rounded-lg text-sm"
        />
        <input
          type="password"
          placeholder="비밀번호를 입력하세요"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-3 p-2 border rounded-lg text-sm"
        />
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <button
          onClick={handleSignup}
          className="w-full bg-pink-400 hover:bg-pink-500 text-white py-2 rounded-lg text-sm"
        >
          회원가입
        </button>
      </div>
    </div>
  );
}
