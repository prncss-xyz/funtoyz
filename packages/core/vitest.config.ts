import { defineConfig, mergeConfig } from 'vitest/config'
export const baseConfig = defineConfig({
	test: {
		coverage: {
			exclude: ['**.test.*'],
			include: ['src/**/*.{js,ts,jsx,tsx}'],
			provider: 'v8',
			reporter: ['text', 'json'],
			thresholds: {
				branches: 100,
				functions: 100,
				lines: 100,
				statements: 100,
			},
		},
		globals: true,
		include: ['src/**/*.test.{js,ts,jsx,tsx}'],
	},
})

export const appConfig = mergeConfig(baseConfig, {
	test: {
		coverage: {
			exclude: ['**'],
		},
	},
})

export default baseConfig
