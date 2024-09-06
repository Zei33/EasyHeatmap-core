/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "selector",
  content: ["./**/*.{php,js}", "!./node_modules/**"],
  theme: {
    extend: {
		spacing: {
			"18": "4.5rem"
		}
	},
  },
  plugins: [],
}

