/**
 * @type {import('lint-staged').Configuration}
 */
export default {
	'*.{js,jsx,ts,tsx,cjs,mjs,mts,cts}': [
		'prettier --write',
		'eslint --fix  --max-warnings 0',
	],
	'*.{json,jsonc,json5,md,mdx,markdown,yaml,yml,css,less,scss,html,gql,graphql,hbs,handlebars,vue}':
		'prettier --write',
}
