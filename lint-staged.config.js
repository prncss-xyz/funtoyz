/**
 * @type {import('lint-staged').Configuration}
 */
export default {
	'*.{js,jsx,ts,tsx,cjs,mjs,mts,cts}': [
		'oxfmt --no-error-on-unmatched-pattern',
		'oxlint --fix',
	],
	'*.{json,jsonc,json5,md,mdx,markdown,yaml,yml,css,less,scss,html,gql,graphql,hbs,handlebars,vue}':
		'oxfmt --no-error-on-unmatched-pattern',
}
