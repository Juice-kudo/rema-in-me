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
        <link href="https://fonts.googleapis.com/css2?family=Pacifico&display=swap" rel="stylesheet" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#fce7f3" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="rema in me" />
      </head>
      <body className="pt-14 sm:pt-0 font-pacifico bg-pink-100">
        <div className="hidden sm:block">
          <Sidebar />
        </div>

        <div className="block sm:hidden">
          <DrawerMenu />
        </div>

        <main className="ml-0 sm:ml-48">{children}</main>
      </body>
    </html>
  );
}
