module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#103C4F",
        accent: "#F47C2C",
      },
      keyframes: {
        "slide-shine": {
          "0%": { left: "-100%" },
          "50%": { left: "100%" },
          "100%": { left: "100%" },
        },
      },
      animation: {
        "slide-shine": "slide-shine 2.5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
