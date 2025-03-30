"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  const handleSignup = async () => {
    if (password !== confirm) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push("/write");
    } catch (err: any) {
      setError("회원가입에 실패했습니다. 이미 사용 중인 이메일일 수 있어요.");
    }
  };

  return (
    <div className="min-h-screen px-4 py-10 sm:ml-0 ml-48 bg-gradient-to-b from-pink-50 to-white flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-6">
        <h1 className="text-3xl sm:text-2xl font-bold text-pink-600 text-center mb-6 font-[Dancing Script]">
          Rema in me
        </h1>

        <input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 p-2 border rounded-lg text-sm"
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-4 p-2 border rounded-lg text-sm"
        />
        <input
          type="password"
          placeholder="비밀번호 확인"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="w-full mb-4 p-2 border rounded-lg text-sm"
        />

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <button
          onClick={handleSignup}
          className="w-full bg-pink-300 hover:bg-pink-400 text-white py-2 rounded-lg text-sm"
        >
          회원가입
        </button>

        <p className="mt-4 text-center text-sm text-gray-500">
          이미 계정이 있으신가요?{" "}
          <span
            className="text-pink-500 underline cursor-pointer"
            onClick={() => router.push("/login")}
          >
            로그인
          </span>
        </p>
      </div>
    </div>
  );
}
