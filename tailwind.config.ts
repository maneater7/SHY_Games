import type { Config } from "tailwindcss";
import { colors } from "./src/config/theme";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors,
      boxShadow: {
        chunky: "0 6px 0 0 #2B2350",
        "chunky-sm": "0 4px 0 0 #2B2350",
      },
      fontFamily: {
        sans: [
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
} satisfies Config;
