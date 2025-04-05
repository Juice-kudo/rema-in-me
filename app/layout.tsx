import "./globals.css";
import { Metadata } from "next";
import { ReactNode } from "react";
import DrawerMenu from "./components/DrawerMenu";

export const metadata: Metadata = {
  title: "rema in me",
  description: "감정과 가치관을 기록하는 감성 일기장",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <head>
        {/* 🌸 Pacifico 폰트 */}
        <link
          href="https://fonts.googleapis.com/css2?family=Pacifico&display=swap"
          rel="stylesheet"
        />
        {/* ✅ PWA용 설정 */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#ec4899" />
      </head>

      <body className="pt-14 sm:pt-0 font-pacifico">
        {/* ❌ 기존 상단 메뉴 제거 */}
        {/* ✅ Drawer 메뉴만 유지 */}
        <DrawerMenu />
        <main className="ml-0 sm:ml-48">{children}</main>
      </body>
    </html>
  );
}
