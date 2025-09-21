import cspell from '@cspell/eslint-plugin'
import jsLint from '@eslint/js'
import perfectionist from 'eslint-plugin-perfectionist'
import react from 'eslint-plugin-react'
import reactCompiler from 'eslint-plugin-react-compiler'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'
import globals from 'globals'
import tsESLint from 'typescript-eslint'

const perf = [
	'warn',
	{
		type: 'natural',
	},
]

export default defineConfig(
	tsESLint.configs.recommended,
	jsLint.configs.recommended,
	{
		files: ['**/*.{js,jsx,ts,tsx}'],
		languageOptions: {
			ecmaVersion: 2022,
			globals: globals.browser,
		},
		plugins: {
			'@cspell': cspell,
			perfectionist,
			react,
			'react-compiler': reactCompiler,
			'react-hooks': reactHooks,
			'react-refresh': reactRefresh,
		},
		rules: {
			'@cspell/spellchecker': [
				'warn',
				{
					cspell: {
						words: [
							'funtoyz',
							'waku',
							'fumadocs',
							'logomark',
							'accs',
							'LTAGS',
							'callbags',
							'succ',
							'unfoldable',
							'errable',
							'juxt',
							'uncurry',
							'uncurried',
							'converger',
							'dichotomic',
							'constellar',
							'elems',
							'Lamarche',
							'prncss',
							'rambda',
							'removables',
							'trush',
							'orama',
							'resulter',
						],
					},
				},
			],
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/no-unused-vars': [
				'warn',
				{
					argsIgnorePattern: '^_',
					caughtErrorsIgnorePattern: '^_',
					varsIgnorePattern: '^_',
				},
			],
			'no-console': 'warn',
			'no-else-return': 'warn',
			'no-empty': 'warn',
			'no-redeclare': 'off',
			'no-undef': 'off',
			'no-unused-vars': 'off',
			'no-useless-rename': ['warn'],
			'object-shorthand': ['warn', 'always'],
			'perfectionist/sort-array-includes': [
				'warn',
				{
					type: 'natural',
				},
			],
			'perfectionist/sort-classes': perf,
			'perfectionist/sort-enums': perf,
			'perfectionist/sort-exports': perf,
			'perfectionist/sort-imports': perf,
			'perfectionist/sort-interfaces': perf,
			'perfectionist/sort-intersection-types': perf,
			'perfectionist/sort-jsx-props': perf,
			'perfectionist/sort-maps': perf,
			'perfectionist/sort-named-exports': perf,
			'perfectionist/sort-named-imports': perf,
			'perfectionist/sort-object-types': perf,
			'perfectionist/sort-objects': perf,
			'perfectionist/sort-sets': perf,
			'perfectionist/sort-switch-case': perf,
			'perfectionist/sort-union-types': perf,
			'perfectionist/sort-variable-declarations': perf,
			'prefer-const': 'off',
		},
	},
	globalIgnores([
		'**/dist/',
		'**/.cache/',
		'**/.turbo/',
		'**/.next/',
		'**/node_modules/',
		'**/build/',
		'**/public/',
		'**/*.json',
		'**/playwright-report/',
		'**/server-build/',
		'**/coverage/',
		'**/*.tsbuildinfo',
		'**/.react-router/',
		'**/*generated*',
		'**/*.gen.*',
		'**/.wrangler/',
		'**/worker-configuration.d.ts',
		'**/next-env.d.ts',
	]),
)
