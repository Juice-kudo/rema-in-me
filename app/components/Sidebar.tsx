"use client";

import { usePathname, useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  const menus = [
    { name: "Remain", path: "/write" },
    { name: "Me", path: "/chat" },
    { name: "Diary", path: "/history" },
  ];

  return (
    <>
      {/* 데스크탑 사이드바 */}
      <aside className="hidden sm:flex fixed left-0 top-0 h-full w-48 flex-col bg-pink-100 p-4 shadow-md z-10">
        <h2
          className="text-xl font-dancing text-pink-600 mb-6 cursor-pointer"
          onClick={() => router.push("/")}
        >
          Rema in me
        </h2>

        {menus.map((menu) => (
          <button
            key={menu.path}
            onClick={() => router.push(menu.path)}
            className={`mb-3 text-left text-sm px-2 py-2 rounded-md hover:bg-pink-200 ${
              pathname === menu.path ? "bg-pink-300 text-white" : "text-gray-700"
            }`}
          >
            {menu.name}
          </button>
        ))}

        <button
          onClick={handleLogout}
          className="mt-auto text-sm text-gray-600 hover:text-red-500"
        >
          로그아웃
        </button>
      </aside>

      {/* 모바일 상단 메뉴 */}
      <nav className="sm:hidden w-full bg-pink-100 p-3 flex justify-between items-center shadow-md fixed top-0 left-0 z-10">
        <h2
          className="text-2xl font-dancing text-pink-600"
          onClick={() => router.push("/")}
        >
          rema in me
        </h2>

        <select
  value={pathname}
  onChange={(e) => {
    if (e.target.value === "logout") {
      handleLogout(); // 실제 로그아웃
    } else {
      router.push(e.target.value); // 다른 페이지 이동
    }
  }}
  className="text-sm text-pink-700 bg-white border border-pink-300 rounded px-2 py-1 shadow-sm"
>
  <option value="/write">Remain</option>
  <option value="/chat">Me</option>
  <option value="/history">Diary</option>
  <option value="logout">로그아웃</option>
</select>

      </nav>
    </>
  );
}
