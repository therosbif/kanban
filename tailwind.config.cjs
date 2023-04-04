const config = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	mode: 'jit',
	theme: {
		extend: {}
	},
	plugins: [require('@tailwindcss/typography'), require('@tailwindcss/forms')]
};

module.exports = config;
