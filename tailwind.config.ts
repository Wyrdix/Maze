import { type Config } from "tailwindcss";

const config: Config = {
  theme: {
    screens: {
      mobile: { max: "480px" },
      tablet: { min: "481px", max: "1024px" },
      desktop: { min: "1025px" },
    },
  },
};

module.exports = config;
