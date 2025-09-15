import { defineConfig } from 'vitest/config'

export default defineConfig({
	test: {
		coverage: {
			include: ['packages/*/src'],
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
		include: ['{packages,apps}/*/src/**/*.test.{js,ts,jsx,tsx}'],
	},
})
