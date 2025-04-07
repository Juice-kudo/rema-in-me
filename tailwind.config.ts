import type { Config } from "tailwindcss";

const config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        pacifico: ["'Pacifico'", "cursive"],
        dancing: ["'Dancing Script'", "cursive"],
      },
    },
  },
  safelist: [
    "level-1",
    "level-2",
    "level-3",
    "level-4",
    "level-5",
  ],
  plugins: [],
} as unknown as Config; // ✅ 타입 단언으로 에러 방지

export default config;
