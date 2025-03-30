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
        <link
          href="https://fonts.googleapis.com/css2?family=Dancing+Script&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="pt-14 sm:pt-0">
        <Sidebar />
        <main className="ml-0 sm:ml-48">{children}</main>
      </body>
    </html>
  );
}
