import './globals.css';
import { Metadata } from 'next';
import { ReactNode } from 'react';
import Sidebar from './components/Sidebar';

export const metadata: Metadata = {
  title: 'rema in me',
  description: '감정과 가치관을 기록하는 감성 일기장',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <head>
        {/* 🌸 Pacifico 폰트 추가 */}
        <link
          href="https://fonts.googleapis.com/css2?family=Pacifico&display=swap"
          rel="stylesheet"
        />
      </head>
      {/* 🌸 전역 Pacifico 적용 */}
      <body className="pt-14 sm:pt-0 font-pacifico">
        <Sidebar />
        <main className="ml-0 sm:ml-48">{children}</main>
      </body>
    </html>
  );
}
