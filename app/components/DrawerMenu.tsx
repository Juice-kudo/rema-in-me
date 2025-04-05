"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function DrawerMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const menus = [
    { name: "Remain", path: "/write" },
    { name: "Me", path: "/chat" },
    { name: "Diary", path: "/history" },
  ];

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  return (
    <>
      {/* 햄버거 버튼 */}
      <button
        onClick={() => setOpen(true)}
        className="fixed top-4 right-4 z-50 sm:hidden text-pink-600 text-xl"
      >
        menu
      </button>

      {/* 드로어 메뉴 */}
      <div
        className={`fixed top-0 right-0 h-full w-35 bg-pink-100 shadow-lg transform transition-transform duration-300 z-40 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-5 flex flex-col gap-4 text-right">
          <button
            onClick={() => setOpen(false)}
            className="text-sm text-gray-500 hover:text-gray-700 self-end"
          >
            닫기 ✕
          </button>

          {menus.map((menu) => (
            <button
              key={menu.path}
              onClick={() => {
                router.push(menu.path);
                setOpen(false);
              }}
              className={`text-base text-pink-700 hover:text-pink-500`}
            >
              {menu.name}
            </button>
          ))}

          <button
            onClick={() => {
              handleLogout();
              setOpen(false);
            }}
            className="mt-6 text-base text-pink-700 hover:text-red-500"
          >
            logout
          </button>
        </div>
      </div>
    </>
  );
}
