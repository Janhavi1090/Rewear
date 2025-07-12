/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./pages/**/*.{js,ts,jsx,tsx}",
      "./components/**/*.{js,ts,jsx,tsx}"
    ],
    theme: {
        extend: {
          colors: {
            blush: "#FFD3E0",
            mint: "#C3F0CA",
            butter: "#FFF5E1",
            lavender: "#D3C4E3",
          },
          fontFamily: {
            pop: ["'Poppins'", "sans-serif"],
          },
        },
      },
      
    plugins: [],
  }
  