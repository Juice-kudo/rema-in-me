import type { Config } from "tailwindcss";

const config: Config = {
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
  // @ts-ignore 👉 TypeScript가 safelist 인식 못해서 무시 처리
  safelist: [
    "level-1",
    "level-2",
    "level-3",
    "level-4",
    "level-5",
  ],
  plugins: [],
};

export default config;
