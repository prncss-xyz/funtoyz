import cspellPlugin from '@cspell/eslint-plugin'
import js from '@eslint/js'
import perfectionist from 'eslint-plugin-perfectionist'
import { defineConfig } from 'eslint/config'
import globals from 'globals'
import tseslint from 'typescript-eslint'

const perf = [
	'warn',
	{
		type: 'natural',
	},
]

export default defineConfig(
	tseslint.configs.recommended,
	js.configs.recommended,
	{
		files: ['**/*.{js,jsx,ts,tsx}'],
		ignores: ['**/dist/**', '**/coverage/**'],
		languageOptions: {
			ecmaVersion: 2022,
			globals: globals.browser,
		},
		plugins: {
			'@cspell': cspellPlugin,
			perfectionist,
		},
		rules: {
			'@cspell/spellchecker': [
				'warn',
				{
					cspell: {
						words: [
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
							'tseslint',
							'trush',
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
			'no-constant-condition': 'off',
			'no-else-return': 'warn',
			'no-empty': 'warn',
			'no-undef': 'off',
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
)
