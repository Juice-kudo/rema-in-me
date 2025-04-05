// components/InstallPrompt.tsx
"use client";

import { useEffect, useState } from "react";

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowButton(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      console.log("✅ 설치 완료!");
    } else {
      console.log("❌ 설치 취소됨.");
    }
    setDeferredPrompt(null);
    setShowButton(false);
  };

  if (!showButton) return null;

  return (
    <div className="fixed bottom-6 left-0 right-0 flex justify-center z-50">
      <button
        onClick={handleInstallClick}
        className="px-6 py-2 bg-pink-400 text-white rounded-full shadow-lg hover:bg-pink-500 transition"
      >
        홈 화면에 추가하기
      </button>
    </div>
  );
}
