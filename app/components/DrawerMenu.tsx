// components/DrawerMenu.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function DrawerMenu() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  return (
    <>
      {/* 햄버거 버튼 */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-20 right-4 sm:hidden bg-pink-300 text-white px-4 py-2 rounded-full shadow"
      >
        ☰
      </button>

      {/* 드로어 메뉴 */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-bold text-pink-600">메뉴</h2>
          <button onClick={() => setOpen(false)} className="text-gray-500">✕</button>
        </div>

        <div className="flex flex-col gap-3 p-4">
          <button
            onClick={() => {
              router.push("/write");
              setOpen(false);
            }}
            className="text-left text-gray-700 hover:text-pink-500"
          >
            📓 오늘 일기 쓰기
          </button>
          <button
            onClick={() => {
              router.push("/chat");
              setOpen(false);
            }}
            className="text-left text-gray-700 hover:text-pink-500"
          >
            💬 과거의 나와 대화
          </button>
          <button
            onClick={() => {
              router.push("/history");
              setOpen(false);
            }}
            className="text-left text-gray-700 hover:text-pink-500"
          >
            📚 지난 일기 보기
          </button>
          <hr />
          <button
            onClick={handleLogout}
            className="text-left text-red-500 hover:underline"
          >
            로그아웃
          </button>
        </div>
      </div>
    </>
  );
}
