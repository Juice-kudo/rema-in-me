import "./globals.css";
import { Metadata } from "next";
import { ReactNode } from "react";
import Sidebar from "./components/Sidebar";
import DrawerMenu from "./components/DrawerMenu";

export const metadata: Metadata = {
  title: "rema in me",
  description: "감정과 가치관을 기록하는 감성 일기장",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <head>
        {/* 🌸 Pacifico 폰트 불러오기 */}
        <link
          href="https://fonts.googleapis.com/css2?family=Pacifico&display=swap"
          rel="stylesheet"
        />

        {/* ✅ PWA + 상단바 색상 (연한 핑크) */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#fce7f3" /> {/* 🌸 연핑크 톤 */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="rema in me" />
      </head>

      <body className="pt-14 sm:pt-0 font-pacifico bg-pink-100">
        {/* ✅ 데스크탑: 좌측 사이드바 */}
        <div className="hidden sm:block">
          <Sidebar />
        </div>

        {/* ✅ 모바일: 오른쪽 드로어 메뉴 */}
        <div className="block sm:hidden">
          <DrawerMenu />
        </div>

        {/* ✅ 페이지 내용 */}
        <main className="ml-0 sm:ml-48">{children}</main>
      </body>
    </html>
  );
}
