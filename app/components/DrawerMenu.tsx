"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function DrawerMenu() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const menus = [
    { name: "Remain", path: "/write" },
    { name: "Me", path: "/chat" },
    { name: "Diary", path: "/history" },
  ];

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
    setOpen(false);
  };

  return (
    <div>
      {/* 상단 고정 버튼 */}
      <button
        onClick={() => setOpen(true)}
        className="fixed top-4 left-4 z-50 bg-pink-300 text-white px-3 py-2 rounded shadow font-pacifico text-sm"
      >
        menu
      </button>

      {/* 드로어 메뉴 */}
      {open && (
        <div className="fixed top-0 left-0 w-full h-full bg-pink-100 z-40 flex flex-col p-6 pt-12">
          <div className="flex justify-between items-center mb-10">
            <span className="text-xl font-pacifico text-pink-700 ml-1">menu</span>
            <button
              onClick={() => setOpen(false)}
              className="text-pink-600 text-2xl font-bold px-2"
            >
              ✕
            </button>
          </div>

          <div className="flex flex-col gap-4">
            {menus.map((menu) => (
              <button
                key={menu.path}
                onClick={() => {
                  router.push(menu.path);
                  setOpen(false);
                }}
                className={`text-lg text-left px-2 py-2 rounded-md font-pacifico ${
                  pathname === menu.path
                    ? "text-white bg-pink-400"
                    : "text-pink-600 hover:bg-pink-200"
                }`}
              >
                {menu.name}
              </button>
            ))}
            <button
              onClick={handleLogout}
              className="mt-4 text-lg px-2 py-2 text-pink-600 rounded-md hover:bg-pink-200 font-pacifico text-left"
            >
              logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
