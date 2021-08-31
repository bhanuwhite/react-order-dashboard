const colors = require("tailwindcss/colors");

module.exports = {
  mode: "jit",
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: "class", // Change to media once we've finished dark mode
  theme: {
    extend: {
      keyframes: {
        zoomInDown: {
          "0%": {
            opacity: "0",
            transform: "scale3d(.1,.1,.1) translate3d(0,-1000px,0)",
            "animation-timing-function": "cubic-bezier(.55,.055,.675,.19)",
          },
          "60%": {
            opacity: "1",
            transform: "scale3d(.475,.475,.475) translate3d(0,60px,0)",
            "animation-timing-function": "cubic-bezier(.175,.885,.32,1)",
          },
        },
        zoomIn: {
          "0%": {
            opacity: "0",
            transform: "scale3d(.3,.3,.3)",
          },
          "50%": {
            opacity: "1",
          },
        },
        fadeOut: {
          "0%": {
            opacity: "1",
          },
          to: {
            opacity: "0",
          },
        },
        fadeInDown: {
          "0%": {
            opacity: "0",
            transform: "translate3d(0,20px,0)",
          },
          "80%": {
            opacity: "1",
          },
          to: {
            opacity: "1",
            transform: "translateZ(0)",
          },
        },
      },
      animation: {
        zoomInDown: "zoomInDown 1s both",
        zoomIn: "zoomIn 300ms ease-out both",
        fadeInDown: "fadeInDown 250ms ease-out both",
        fadeOut: "fadeOut 400ms both",
      },
    },
    colors: {
      // Generic colors utilities
      transparent: "transparent",
      current: "currentColor",
      black: colors.black,
      white: colors.white,
      gray: colors.gray,
      blue: colors.blue,
      green: colors.green,
      yellow: colors.yellow,
      red: colors.red,
      purple: colors.purple,
      pink: colors.pink,
      // Veea colors
      primary: "#396EFF",
      "primary-light": "#577DFF",
      "primary-dark": "#224cbe",
      bad: "#EB2020",
      "bad-light": "#F35F5F",
      "bad-dark": "#b11515",
      good: "#53C716",
      "good-light": "#8ee063",
      "good-dark": "#3f9411",
      neutral: "#909090",
      "neutral-light": "#a0a0a0",
      "neutral-dark": "#707070",
      warn: "#F8BE20",
      veea: "#B9090F",
      "clear-white": "#FAFAFA",
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
