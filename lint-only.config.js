/**
 * @type {import('lint-staged').Configuration}
 */
export default {
	'*.{js,jsx,ts,tsx,json,md,yaml,yml}': 'prettier --list-different',
	'*.{json,md,yaml,yml}': 'eslint',
}
