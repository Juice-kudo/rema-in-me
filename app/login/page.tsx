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
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 bg-cover bg-no-repeat bg-center"
      style={{
        backgroundImage: `url('/logo-pink.png')`,
        backgroundSize: 'cover',
      }}
    >
      {/* 로고 텍스트 강조 */}
      <div className="absolute top-14 text-3xl font-[500] text-pink-600 drop-shadow-md">
        Rema in me
      </div>

      {/* 로그인 폼 */}
      <div className="mt-32 w-full max-w-sm bg-white/70 backdrop-blur-lg p-6 rounded-3xl shadow-md">
        <h1 className="text-xl font-semibold text-gray-700 mb-4 text-center">로그인</h1>

        <input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-3 p-3 border border-gray-300 rounded-xl text-sm bg-white placeholder-gray-400"
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-3 p-3 border border-gray-300 rounded-xl text-sm bg-white placeholder-gray-400"
        />

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <button
          onClick={handleLogin}
          className="w-full bg-pink-500 hover:bg-pink-600 text-white py-2 rounded-xl text-sm transition-all"
        >
          로그인
        </button>

        <p className="text-sm text-center text-gray-600 mt-4">
          계정이 없으신가요?{' '}
          <Link href="/signup" className="text-pink-500 hover:underline">
            회원가입
          </Link>
        </p>
      </div>
    </div>
  );
}
