const colors = require('tailwindcss/colors')

module.exports = {
	content: [
		"./pages/**/*.{js,ts,jsx,tsx}",
		"./components/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {
		  colors: {
			cyan: colors.cyan,
		  },
		},
	  },
	fontFamily: {
		sans: [
			'ui-sans-serif',
			'system-ui',
			'-apple-system',
			'BlinkMacSystemFont',
			'"Segoe UI"',
			'Roboto',
			'"Helvetica Neue"',
			'Arial',
			'"Noto Sans"',
			'sans-serif',
			'"Apple Color Emoji"',
			'"Segoe UI Emoji"',
			'"Segoe UI Symbol"',
			'"Noto Color Emoji"',
		],
		serif: ['ui-serif', 'Georgia', 'Cambria', '"Times New Roman"', 'Times', 'serif'],
		mono: [
			'ui-monospace',
			'SFMono-Regular',
			'Menlo',
			'Monaco',
			'Consolas',
			'"Liberation Mono"',
			'"Courier New"',
			'monospace',
		],
		body: ["Nunito", "HelveticaNeue", "Helvetica Neue", "Helvetica", "Arial", "sans-serif"]
	},
	plugins: [
		require('@tailwindcss/forms')
	]
}
