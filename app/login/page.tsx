'use client';

import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

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
      className="min-h-screen bg-cover bg-center flex items-center justify-center p-4"
      style={{
        backgroundImage: `url("/logo-pink.png")`, // public 폴더에 있는 로고 배경
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'contain',
        backgroundPosition: 'center',
      }}
    >
      <div className="bg-white/70 backdrop-blur-lg p-6 rounded-3xl shadow-lg w-full max-w-sm">
        <h1 className="text-2xl font-bold text-gray-700 mb-4 text-center">로그인</h1>
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
          className="w-full bg-gray-700 hover:bg-gray-800 text-white py-2 rounded-xl text-sm transition-all"
        >
          로그인
        </button>
      </div>
    </div>
  );
}
