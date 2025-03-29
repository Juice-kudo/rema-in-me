'use client';

import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    try {
      setError('');
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/write');
    } catch (err: any) {
      setError('이메일 또는 비밀번호가 올바르지 않습니다.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-pink-100 via-pink-200 to-pink-100 px-4">
      <div className="w-full max-w-sm bg-white/80 backdrop-blur-md p-6 rounded-3xl shadow-md">
        <h1 className="text-3xl font-bold text-pink-500 mb-6 text-center">로그인</h1>

        <input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-3 p-3 border border-pink-200 rounded-xl text-sm bg-white placeholder-pink-300"
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-3 p-3 border border-pink-200 rounded-xl text-sm bg-white placeholder-pink-300"
        />

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <button
          onClick={handleLogin}
          className="w-full bg-pink-400 hover:bg-pink-500 text-white py-2 rounded-xl text-sm transition-all"
        >
          로그인
        </button>

        <p className="text-sm text-center text-pink-600 mt-4">
          계정이 없으신가요?{' '}
          <Link href="/signup" className="underline hover:text-pink-700">
            회원가입
          </Link>
        </p>
      </div>
    </div>
  );
}
