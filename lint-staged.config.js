/**
 * @type {import('lint-staged').Configuration}
 */
export default {
	'!*.{js,jsx,ts,tsx,cjs,mjs,mts,cts}': 'prettier --write',
	'*.{js,jsx,ts,tsx,cjs,mjs,mts,cts}': ['prettier --write', 'eslint --fix'],
}
