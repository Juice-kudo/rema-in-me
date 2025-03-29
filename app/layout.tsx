// app/layout.tsx

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
      <body className="flex">
        <Sidebar />
        <div className="ml-48 w-full">{children}</div>
      </body>
    </html>
  );
}
