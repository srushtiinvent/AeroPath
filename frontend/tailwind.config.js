export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      boxShadow: {
        soft: "0 24px 80px rgba(15,23,42,0.08)",
      },
      colors: {
        midnight: "#0f172a",
        slate: "#1e293b",
        sky: "#38bdf8",
        premium: "#2563eb",
      },
    },
  },
  plugins: [],
};
