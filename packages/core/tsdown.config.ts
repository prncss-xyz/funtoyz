import { defineConfig } from 'tsdown'

export default defineConfig({
	dts: true,
	entry: ['src/**/*.{js,ts,jsx,tsx}', '!**/*.test.*'],
	exports: true,
	failOnWarn: true,
	platform: 'neutral',
})
