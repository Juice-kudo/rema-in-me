"use client";

import { usePathname, useRouter } from "next/navigation";

export default function BottomTab() {
  const pathname = usePathname();
  const router = useRouter();

  const menus = [
    { icon: "📓", path: "/write", label: "Remain" },
    { icon: "💬", path: "/chat", label: "Me" },
    { icon: "📚", path: "/history", label: "Diary" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full sm:hidden bg-white border-t shadow-md flex justify-around items-center py-2 z-50">
      {menus.map((menu) => (
        <button
          key={menu.path}
          onClick={() => router.push(menu.path)}
          className={`text-lg flex flex-col items-center ${
            pathname === menu.path ? "text-pink-500" : "text-gray-500"
          }`}
        >
          <span>{menu.icon}</span>
          <span className="text-xs">{menu.label}</span>
        </button>
      ))}

      {/* 햄버거 아이콘 */}
      <button
        onClick={() => alert("여기에 모달 또는 드로어 메뉴 추가 예정")}
        className="text-lg flex flex-col items-center text-gray-500"
      >
        <span>☰</span>
        <span className="text-xs">More</span>
      </button>
    </nav>
  );
}
